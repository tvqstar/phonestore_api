const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, require: true },
        image: { type: String, required: true },
        colors: [
            {
                colorName: { type: String, required: true },
                inStock: { type: Number, require: true },
            },
        ],
        description: { type: String, require: true },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'DanhMuc',
            required: true,
        },
        price: { type: Number, require: true },
    },
    {
        timestamps: true,
    },
);
const Product = mongoose.model('SanPham', productSchema);
module.exports = Product;
