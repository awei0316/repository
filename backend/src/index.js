const mongoose = require('mongoose');
const connectDB = require('./config/db');
const GdpGrowthRate = require('./models/gdpGrowthRate');
const InflationRate = require('./models/inflationRate');
const UnemploymentRate = require('./models/unemploymentRate');
const ExchangeRate = require('./models/exchangeRate');
const axios = require('axios');

// 定义世界银行 API 的请求 URL 和请求体
const apiUrl = 'https://data360.worldbank.org/api/data360/search';
const requestBody = {
    "search": "",
    "filters": {
        "source": ["World Development Indicators"],
        "country": [],
        "topic": [],
        "indicator": [],
        "year": []
    },
    "sort": {
        "by": "name",
        "order": "asc"
    },
    "page": 1,
    "pageSize": 10
};

const collectAndStoreData = async () => {
    try {
        // 连接到数据库
        await connectDB();

        // 定义指标代码
        const indicators = {
            gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
            inflation: 'FP.CPI.TOTL.ZG',
            unemployment: 'SL.UEM.TOTL.ZS',
            exchangeRate: 'PA.NUS.FCRF'
        };

        // 遍历每个指标
        for (const [key, indicatorCode] of Object.entries(indicators)) {
            const newRequestBody = {
                ...requestBody,
                filters: {
                    ...requestBody.filters,
                    indicator: [indicatorCode]
                }
            };

            // 发送请求到世界银行 API
            const response = await axios.post(apiUrl, newRequestBody);
            const data = response.data.results;

            if (data.length > 0) {
                for (const item of data) {
                    const country = item.country.name;
                    const rate = parseFloat(item.value);
                    const date = new Date(item.year);

                    let model;
                    let dataToSave;

                    switch (key) {
                        case 'gdpGrowth':
                            model = GdpGrowthRate;
                            dataToSave = {
                                country,
                                rate,
                                date
                            };
                            break;
                        case 'inflation':
                            model = InflationRate;
                            dataToSave = {
                                country,
                                rate,
                                date
                            };
                            break;
                        case 'unemployment':
                            model = UnemploymentRate;
                            dataToSave = {
                                country,
                                rate,
                                date
                            };
                            break;
                        case 'exchangeRate':
                            model = ExchangeRate;
                            dataToSave = {
                                country,
                                rate,
                                date
                            };
                            break;
                        default:
                            continue;
                    }

                    const newData = new model(dataToSave);
                    await newData.save();
                    console.log(`${key} data for ${country} saved`);
                }
            }
        }

        console.log('All data saved successfully');
    } catch (err) {
        console.error(err.message);
    } finally {
        // 关闭数据库连接
        mongoose.connection.close();
    }
};

collectAndStoreData();