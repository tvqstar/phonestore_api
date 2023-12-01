const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaiKhoan',
            require: true,
        },
        items: [
            {
                productId: { type: String, required: true },
                product_name: { type: String, required: true },
                color: { type: String, required: true },
                quantity: { type: Number, require: true },
                price: { type: Number, require: true },
                description: { type: String, require: true },
                image: { type: String, required: true },
            },
        ],
    },
    {
        timestamps: true,
    },
);
const Cart = mongoose.model('GioHang', cartSchema);
module.exports = Cart;
