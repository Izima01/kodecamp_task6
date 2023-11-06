const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, 'You need a username'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'You need an email'],
        unique: true
    },
    phoneNumber: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isNewUser: {
        type: Boolean,
        required: true
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date
});

const userCollection = mongoose.model('users', userSchema);

module.exports = userCollection;