const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')

const OTPVerificatonSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        expires: 3600,
        default: Date.now()
    }
})

module.exports = OTPVerificaton = mongoose.model('optVerificaton', OTPVerificatonSchema)