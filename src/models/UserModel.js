const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        email: { type: String, required: true },
        isAdmin: { type: Boolean, default: false, required: true },
        status: { type: Boolean, default: true, required: true },
        // access_token: { type: String, required: false },
        // refresh_token: { type: String, required: false },
    },
    {
        timestamps: true,
    },
);
const User = mongoose.model('TaiKhoan', userSchema);
module.exports = User;
