const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const policyNoticeSchema = new mongoose.Schema({
    id: {
        type: String,
        default: () => uuidv4(),
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const PolicyNotice = mongoose.model('PolicyNotice', policyNoticeSchema);

module.exports = PolicyNotice;