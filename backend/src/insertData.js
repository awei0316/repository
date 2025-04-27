// src/insertData.js
const connectDB = require('./config/db');
const Data = require('./models/data');

// 定义要插入的数据
const sampleData = {
    gdpGrowthRate: { "2023": 3.5 },
    inflationRate: { "2023": 2.0 },
    unemploymentRate: { "2023": 5.0 },
    chinaTrade: {
        importExportVolume: { "2023": 1000000 },
        importPrice: { "2023": 100 },
        exportPrice: { "2023": 120 },
        tradeBalance: { "2023": 200000 },
        stockPrice: { "2023": 50 },
        portThroughput: { "2023": 50000 }
    },
    exchangeRate: { "2023": 6.5 },
    policyNotice: ["New policy announced"],
    financialStatements: ["Statement 1", "Statement 2"]
};

// 连接数据库并插入数据
const insertData = async () => {
    try {
        await connectDB();
        // 创建数据实例
        const newData = new Data(sampleData);
        // 保存数据到数据库
        await newData.save();
        console.log('Data inserted successfully');
        process.exit(0);
    } catch (err) {
        console.error('Error inserting data:', err);
        process.exit(1);
    }
};

// 运行插入数据函数
insertData();