const express = require('express');
const axios = require('axios');
const connectDB = require('./src/config/db');
const Data = require('./src/models/data');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 连接数据库
connectDB();

// 获取主要国家 GDP 增长率
const getGDPGrowthRate = async () => {
    try {
        const response = await axios.get('https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.KD.ZG?format=json');
        return response.data;
    } catch (err) {
        console.error(err);
        return {};
    }
};

// 获取主要国家通货膨胀率
const getInflationRate = async () => {
    try {
        const response = await axios.get('https://api.worldbank.org/v2/country/all/indicator/FP.CPI.TOTL.ZG?format=json');
        return response.data;
    } catch (err) {
        console.error(err);
        return {};
    }
};

// 获取主要国家失业率
const getUnemploymentRate = async () => {
    try {
        const response = await axios.get('https://api.worldbank.org/v2/country/all/indicator/SL.UEM.TOTL.ZS?format=json');
        return response.data;
    } catch (err) {
        console.error(err);
        return {};
    }
};

// 其他获取数据的函数可以根据上述推荐的 API 进行修改

// 定时任务，定期获取数据并存储到数据库
const fetchAndSaveData = async () => {
    const gdpGrowthRate = await getGDPGrowthRate();
    const inflationRate = await getInflationRate();
    const unemploymentRate = await getUnemploymentRate();
    const chinaImportExportVolume = await getChinaImportExportVolume();
    const chinaImportPrice = await getChinaImportPrice();
    const chinaExportPrice = await getChinaExportPrice();
    const chinaTradeBalance = await getChinaTradeBalance();
    const chinaStockPrice = await getChinaStockPrice();
    const exchangeRate = await getExchangeRate();
    const policyNotice = await getPolicyNotice();
    const financialStatements = await getFinancialStatements();
    const portThroughput = await getPortThroughput();

    const newData = new Data({
        gdpGrowthRate,
        inflationRate,
        unemploymentRate,
        chinaTrade: {
            importExportVolume: chinaImportExportVolume,
            importPrice: chinaImportPrice,
            exportPrice: chinaExportPrice,
            tradeBalance: chinaTradeBalance,
            stockPrice: chinaStockPrice,
            portThroughput
        },
        exchangeRate,
        policyNotice,
        financialStatements
    });

    try {
        await newData.save();
        console.log('Data saved successfully');
    } catch (err) {
        console.error(err);
    }
};

// 启动定时任务，每隔一段时间执行一次
setInterval(fetchAndSaveData, 1000 * 60 * 60 * 24); // 每天执行一次

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});