const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const unemploymentRateSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    country: {
        type: String,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const UnemploymentRate = mongoose.model('UnemploymentRate', unemploymentRateSchema);

module.exports = UnemploymentRate;