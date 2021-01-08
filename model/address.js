const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    house_no: {
        type: String,
        required: false 
    },
    street_address: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    pin_code: {
        type: String,
        required: false 
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    }
})

module.exports = mongoose.model('Address', addressSchema);