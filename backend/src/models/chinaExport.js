const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chinaExportSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    exportVolume: {
        type: Number,
        required: true
    },
    exportPrice: {
        type: Number,
        required: true
    },
    tradeBalance: {
        type: Number,
        required: true
    },
    portThroughput: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ChinaExport = mongoose.model('ChinaExport', chinaExportSchema);

module.exports = ChinaExport;