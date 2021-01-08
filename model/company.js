const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    company_name: {
        type: String,
        default: null
    },
    company_email: {
        type: String,
        default: null
    },
    company_phone: {
        type: String,
        default: null
    },
    company_address: {
        type: String,
        default: null
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    }
})

module.exports = mongoose.model('Company', companySchema);