const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chinaStockSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    stockPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ChinaStock = mongoose.model('ChinaStock', chinaStockSchema);

module.exports = ChinaStock;