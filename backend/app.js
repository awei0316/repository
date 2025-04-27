// app.js
const connectDB = require('./src/config/db');
const Data = require('./src/models/data');

// 连接数据库
connectDB();

// 模拟数据收集函数，实际使用时需要替换为真实的数据源
const collectData = async () => {
    try {
        // 模拟获取主要国家GDP增长率
        const gdpGrowthRate = { "2023": 3.5 };
        // 模拟获取主要国家通货膨胀率
        const inflationRate = { "2023": 2.0 };
        // 模拟获取主要国家失业率
        const unemploymentRate = { "2023": 5.0 };
        // 模拟获取中国进出口总额及增长速度
        const importExportVolume = { "2023": 1000000 };
        // 模拟获取中国商品进口价格
        const importPrice = { "2023": 100 };
        // 模拟获取中国商品出口价格
        const exportPrice = { "2023": 120 };
        // 模拟获取中国贸易平衡数据
        const tradeBalance = { "2023": 200000 };
        // 模拟获取中国市场价格（股票）
        const stockPrice = { "2023": 50 };
        // 模拟获取主要国家与人民币汇率
        const exchangeRate = { "2023": 6.5 };
        // 模拟获取政策法规通知
        const policyNotice = ["New policy announced"];
        // 模拟获取财务报表
        const financialStatements = ["Statement 1", "Statement 2"];
        // 模拟获取中国与外国主要港口吞吐量数据
        const portThroughput = { "2023": 50000 };

        // 格式化数据
        const sampleData = {
            gdpGrowthRate,
            inflationRate,
            unemploymentRate,
            chinaTrade: {
                importExportVolume,
                importPrice,
                exportPrice,
                tradeBalance,
                stockPrice,
                portThroughput
            },
            exchangeRate,
            policyNotice,
            financialStatements
        };

        // 创建数据实例
        const newData = new Data(sampleData);

        // 保存数据到数据库
        await newData.save();
        console.log('Data inserted successfully');
    } catch (err) {
        console.error('Error inserting data:', err);
    }
};

// 运行数据收集函数
collectData();