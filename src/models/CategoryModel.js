const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);
const Category = mongoose.model('DanhMuc', categorySchema);
module.exports = Category;
