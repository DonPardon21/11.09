const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    login: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    lastLogin: { type: Date }, // Dodaj pole lastLogin
});

module.exports = mongoose.model('User', UserSchema);