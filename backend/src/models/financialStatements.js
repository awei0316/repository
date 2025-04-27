const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const financialStatementsSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    company: {
        type: String,
        required: true
    },
    statement: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const FinancialStatements = mongoose.model('FinancialStatements', financialStatementsSchema);

module.exports = FinancialStatements;