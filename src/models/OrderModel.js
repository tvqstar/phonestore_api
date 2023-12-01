const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'TaiKhoan',
            require: true,
        },
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { type: Number, require: true },
        status: { type: String, enum: ['Chờ xác nhận', 'Đang giao', 'Đã giao', 'Đã hủy'], default: 'Chờ xác nhận' },
        items: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId },
                product_name: { type: String, required: true },
                color: { type: String, required: true },
                quantity: { type: Number, require: true },
                price: { type: Number, require: true },
                description: { type: String, require: true },
                image: { type: String, required: true },
            },
        ],
        totalPrice: { type: Number, require: true },
    },
    {
        timestamps: true,
    },
);
const Order = mongoose.model('DonHang', orderSchema);
module.exports = Order;
