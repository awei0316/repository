const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    gdpGrowthRate: {
        type: Object,
        default: {}
    },
    inflationRate: {
        type: Object,
        default: {}
    },
    unemploymentRate: {
        type: Object,
        default: {}
    },
    chinaTrade: {
        importExportVolume: {
            type: Object,
            default: {}
        },
        importPrice: {
            type: Object,
            default: {}
        },
        exportPrice: {
            type: Object,
            default: {}
        },
        tradeBalance: {
            type: Object,
            default: {}
        },
        stockPrice: {
            type: Object,
            default: {}
        },
        portThroughput: {
            type: Object,
            default: {}
        }
    },
    exchangeRate: {
        type: Object,
        default: {}
    },
    policyNotice: {
        type: Array,
        default: []
    },
    financialStatements: {
        type: Array,
        default: []
    }
});

const Data = mongoose.model('Data', dataSchema);

module.exports = Data;