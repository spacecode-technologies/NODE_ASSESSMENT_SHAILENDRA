const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        default: null
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
    },
    role: {
        type: String
    },
    // role: {
    //     type: [String]
    // },
    phone_number: {
        type: String,
        unique: true,
        required: true 
    },
    password: { 
        type: String, 
        required: true,
        trim: true
    },
    created_at: {
        type: String
    },
    updated_at: {
        type: String
    }
})
module.exports = mongoose.model('Users', usersSchema);