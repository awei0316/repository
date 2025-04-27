const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const chinaImportSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    importVolume: {
        type: Number,
        required: true
    },
    importPrice: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const ChinaImport = mongoose.model('ChinaImport', chinaImportSchema);

module.exports = ChinaImport;