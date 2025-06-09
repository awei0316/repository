from flask import Flask, jsonify
import pandas as pd
import os

app = Flask(__name__)

# 项目 2 中 data 文件夹的路径（根据实际目录结构调整）
PROJECT2_DATA_DIR = "/data"

@app.route('/api/data/trade-trend')
def get_trade_trend_data():
    file_path = os.path.join(PROJECT2_DATA_DIR, '进出口贸易额.xlsx')
    try:
        df = pd.read_excel(file_path)
        # 假设 Excel 中有 '年份' 和 '进出口贸易额' 两列
        data = {
            'years': df['年份'].tolist(),
            'values': df['进出口贸易额'].tolist()
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/data/customs-rank')
def get_customs_rank_data():
    file_path = os.path.join(PROJECT2_DATA_DIR, '进出口商品关别总值.xlsx')
    try:
        df = pd.read_excel(file_path)
        data = {
            'customs': df['关别'].tolist(),
            'imports': df['进口总值'].tolist(),
            'exports': df['出口总值'].tolist()
        }
        return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# 为其他图表添加类似的 API 端点...

if __name__ == '__main__':
    app.run(debug=True)