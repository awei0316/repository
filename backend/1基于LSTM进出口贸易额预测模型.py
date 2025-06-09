import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_squared_error, mean_absolute_error
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import tensorflow as tf
import warnings
from Lib.busGoods import *
warnings.filterwarnings('ignore')

# 设置随机种子确保结果可复现
np.random.seed(42)
tf.random.set_seed(42)
plt.rcParams['font.family'] = ['SimHei', 'WenQuanYi Micro Hei']  # 优先使用黑体
plt.rcParams['axes.unicode_minus'] = False  # 解决负号显示问题

class TradeForecaster:
    def __init__(self, seq_length=5):  # 调整默认历史序列长度为5年
        """
        初始化贸易额预测器
        seq_length: 用于预测的历史序列长度（年数）
        """
        self.seq_length = seq_length
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.model = None
        self.data = None

    def load_data(self, file_path):

        # 从Excel文件读取数据（假设文件包含年份和贸易额两列）
        if file_path is None:
            raise ValueError("请提供文件路径或使用示例数据")
        self.data = pd.read_excel(file_path)
        # 确保列名为'年份'和'进出口贸易额'
        self.data.columns = ['年份', '进出口贸易额']
        # 检查年份是否为数值型，否则转换
        if not pd.api.types.is_integer_dtype(self.data['年份']):
            self.data['年份'] = pd.to_numeric(self.data['年份'], errors='coerce')
            self.data = self.data.dropna(subset=['年份'])
            self.data['年份'] = self.data['年份'].astype(int)
        # 按年份排序
        self.data = self.data.sort_values(by='年份').reset_index(drop=True)
        print(f"数据加载完成，共{len(self.data)}条记录")
        return self.data

    def _generate_sample_data(self):
        """生成示例年度贸易额数据（1981-2024年）"""
        np.random.seed(42)
        years = np.arange(1981, 2025)  # 44年数据
        # 趋势项
        trend = np.linspace(100, 2000, len(years))
        # 噪声
        noise = np.random.normal(0, 100, len(years))
        # 生成贸易额数据
        trade_volume = trend + noise
        # 创建DataFrame
        df = pd.DataFrame({
            '年份': years,
            '进出口贸易额': trade_volume
        })
        return df

    def preprocess_data(self):
        """数据预处理：标准化和序列构建（按年份）"""
        if self.data is None:
            raise ValueError("请先加载数据")

        # 检查数据是否包含足够年份
        if len(self.data) < self.seq_length + 1:
            raise ValueError(f"数据需要至少{self.seq_length + 1}年，当前{len(self.data)}年")

        # 提取贸易额列
        values = self.data['进出口贸易额'].values.reshape(-1, 1)

        # 数据标准化
        scaled_data = self.scaler.fit_transform(values)

        # 构建序列数据（每个样本为连续n年，预测下一年）
        X, y = [], []
        for i in range(len(scaled_data) - self.seq_length):
            X.append(scaled_data[i:i + self.seq_length, 0])  # n年历史数据
            y.append(scaled_data[i + self.seq_length, 0])  # 下一年数据

        X, y = np.array(X), np.array(y)

        # 重塑数据以适应LSTM输入 [样本数, 时间步, 特征数]
        X = np.reshape(X, (X.shape[0], X.shape[1], 1))

        # 划分训练集和测试集（80%训练，20%测试）
        train_size = int(len(X) * 0.8)
        X_train, X_test = X[:train_size], X[train_size:]
        y_train, y_test = y[:train_size], y[train_size:]

        print(f"训练集样本数: {len(X_train)}, 测试集样本数: {len(X_test)}")
        return X_train, X_test, y_train, y_test

    def build_model(self):
        """构建LSTM模型（针对年度数据优化）"""
        model = Sequential()
        # 输入形状：(seq_length, 1) 即n年历史数据
        model.add(LSTM(64, return_sequences=True, input_shape=(self.seq_length, 1)))
        model.add(Dropout(0.2))
        model.add(LSTM(64, return_sequences=True))
        model.add(Dropout(0.2))
        model.add(LSTM(64))
        model.add(Dropout(0.2))
        model.add(Dense(1))  # 输出下一年预测值
        model.compile(optimizer='adam', loss='mse')
        self.model = model
        print("模型构建完成")
        return model

    def train_model(self, X_train, y_train, epochs=100, batch_size=8):
        """训练LSTM模型"""
        if self.model is None:
            self.build_model()

        early_stopping = EarlyStopping(
            monitor='val_loss',
            patience=10,
            restore_best_weights=True,
            verbose=1
        )

        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=batch_size,
            validation_split=0.2,
            callbacks=[early_stopping],
            verbose=1
        )

        self._plot_training_history(history)
        return history

    def _plot_training_history(self, history):
        """绘制训练历史"""
        plt.figure(figsize=(10, 5))
        plt.plot(history.history['loss'], label='训练损失')
        plt.plot(history.history['val_loss'], label='验证损失')
        plt.title('模型训练损失（年度数据）')
        plt.xlabel('Epoch')
        plt.ylabel('MSE')
        plt.legend()
        plt.grid(True)
        #plt.show()
        plt.savefig("static/Pic/模型训练损失.png", dpi=300, bbox_inches='tight')

    def evaluate_model(self, X_test, y_test):
        """评估模型性能"""
        if self.model is None:
            raise ValueError("请先训练模型")

        # 预测
        y_pred_scaled = self.model.predict(X_test)
        # 反标准化
        y_pred = self.scaler.inverse_transform(y_pred_scaled)
        y_test_actual = self.scaler.inverse_transform(y_test.reshape(-1, 1))

        # 计算指标
        mse = mean_squared_error(y_test_actual, y_pred)
        rmse = np.sqrt(mse)
        mae = mean_absolute_error(y_test_actual, y_pred)

        print(f"\n评估指标（年度数据）:")
        print(f"MSE: {mse:.2f}, RMSE: {rmse:.2f}, MAE: {mae:.2f}")
        self._plot_predictions(y_test_actual, y_pred)
        return {
            'mse': mse,
            'RMSE': rmse,
            'MAE': mae,
            'actual': y_test_actual.flatten(),
            'predicted': y_pred.flatten()
        }

    def _plot_predictions(self, actual, predicted):
        """绘制预测结果与实际值对比（年度数据）"""
        plt.figure(figsize=(12, 6))
        # 获取测试集对应的年份（最后20%数据的起始索引）
        test_start_index = len(self.data) - len(actual) - self.seq_length
        test_years = self.data['年份'].iloc[test_start_index + self.seq_length:].values  # 实际年份对应预测值

        plt.scatter(test_years, actual, label='实际值', color='blue')
        plt.scatter(test_years, predicted, label='预测值', color='red', marker='x')
        plt.title('LSTM模型预测结果（年度数据）')
        plt.xlabel('年份')
        plt.ylabel('进出口贸易额')
        plt.legend()
        plt.grid(True)
        plt.xticks(test_years[::2])  # 每2年显示一次刻度
        #plt.show()
        plt.savefig("static/Pic/LSTM模型预测结果.png", dpi=300, bbox_inches='tight')


    def forecast_future(self, steps=5, plot=True):
        """预测未来年份的贸易额"""
        if self.model is None:
            raise ValueError("请先训练模型")

        # 检查现有数据是否足够
        if len(self.data) < self.seq_length:
            raise ValueError(f"需要至少{self.seq_length}年历史数据，当前{len(self.data)}年")

        # 获取最后n年历史数据
        last_years_data = self.data['进出口贸易额'].values[-self.seq_length:].reshape(1, self.seq_length, 1)
        last_year = self.data['年份'].iloc[-1]  # 最后一个已知年份

        # 标准化
        last_years_scaled = self.scaler.transform(last_years_data.reshape(-1, 1)).reshape(1, self.seq_length, 1)

        # 递归预测未来steps年
        future_predictions = []
        current_sequence = last_years_scaled.copy()

        for _ in range(steps):
            next_step_scaled = self.model.predict(current_sequence, verbose=0)
            future_predictions.append(next_step_scaled[0, 0])

            # 更新序列：移除最早一年，添加预测值（作为下一年输入）
            current_sequence = np.roll(current_sequence, -1, axis=1)
            current_sequence[0, -1, 0] = next_step_scaled[0, 0]

        # 反标准化并生成年份
        future_predictions = self.scaler.inverse_transform(np.array(future_predictions).reshape(-1, 1)).flatten()
        future_years = np.arange(last_year + 1, last_year + steps + 1)  # 生成未来年份

        # 创建结果DataFrame
        forecast_df = pd.DataFrame({
            '年份': future_years,
            '进出口贸易额': future_predictions
        })

        if plot:
            self._plot_forecast(forecast_df)

        return forecast_df

    def _plot_forecast(self, forecast_df):
        """绘制历史数据与未来预测（年度数据）"""
        plt.figure(figsize=(12, 6))
        # 绘制历史数据
        plt.plot(self.data['年份'], self.data['进出口贸易额'], label='历史数据', marker='o', linestyle='-')
        # 绘制预测数据
        plt.plot(forecast_df['年份'], forecast_df['进出口贸易额'], label='预测数据', marker='s', linestyle='--', color='red')

        plt.title('进出口贸易额历史与预测（年度数据）')
        plt.xlabel('年份')
        plt.ylabel('贸易额')
        plt.legend()
        plt.grid(True)
        plt.xticks(np.arange(self.data['年份'].min(), forecast_df['年份'].max() + 1, 2))  # 每2年显示刻度
        plt.tight_layout()
        #plt.show()
        plt.savefig("static/Pic/进出口贸易额历史与预测.png", dpi=300, bbox_inches='tight')


# 主函数：执行训练和预测
def main():
    # 创建预测器（使用5年历史数据预测下一年）
    forecaster = TradeForecaster(seq_length=5)

    # 加载真实数据或生成示例数据
    forecaster.load_data('data/进出口贸易额.xls')  # 取消注释以加载真实数据

    # 数据预处理
    X_train, X_test, y_train, y_test = forecaster.preprocess_data()

    # 训练模型
    history = forecaster.train_model(X_train, y_train, epochs=100, batch_size=8)

    # 评估模型
    results = forecaster.evaluate_model(X_test, y_test)
    _busGoods=busGoods()
    _busGoods.write_content_list_to_file("data/tag.txt", str(results.get("RMSE")) + "|" + str( results.get("MAE") ))

    # 预测未来5年
    future_forecast = forecaster.forecast_future(steps=5)
    print("\n未来5年预测结果:")
    print(future_forecast)


if __name__ == "__main__":
    main()