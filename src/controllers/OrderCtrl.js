const Order = require('../models/OrderModel');
const Cart = require('../models/CartModel');
const Product = require('../models/ProductModel');

const getOrderById = async (req, res) => {
    try {
        const idUser = req.params.id;
        const cart = await Order.find({ user: idUser });
        return res.json(cart);
    } catch (error) {
        return res.json('Có lỗi');
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await Order.find({});
        return res.json(order);
    } catch (error) {
        return res.json('Có lỗi');
    }
};

const addOrder = async (req, res) => {
    try {
        const data = req.body;
        if (!data.user || !data.address || !data.items || !data.name || !data.phone || !data.totalPrice) {
            return res.json('Thêm đầy đủ thông tin');
        }

        const order = await Order.create({
            user: data.user,
            name: data.name,
            phone: data.phone,
            address: data.address,
            items: data.items,
            totalPrice: data.totalPrice,
        });
        const cartUpdated = await Cart.findOneAndUpdate({ user: data.user }, { $set: { items: [] } }, { new: true }).exec();

        // for (prod of prodOrder) {
        //     idProd.push(prod.productId);
        //     const products = await Product.find({
        //         _id: { $in: idProd },
        //     });
        // }

        if (order && cartUpdated) {
            const prodOrder = data.items;
            for (prod of prodOrder) {
                // const prodUpdate = {
                //     idprod: prod.productId,
                //     colorname: prod.color,
                //     quantity: prod.quantity,
                // };

                const product = await Product.findOne({ _id: prod.productId, 'colors.colorName': prod.color }).exec();
                if (product) {
                    const color = product.colors.find((color) => color.colorName === prod.color);

                    if (color) {
                        color.inStock -= prod.quantity;

                        await product.save();
                    }
                }
            }
        }
        return res.json({
            status: 'SUCCESS',
        });
    } catch (error) {
        return res.json(error);
    }
};

const editOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        const checkOrder = await Order.find({ _id: id });
        if (!checkOrder) {
            return res.json('Đơn hàng không tồn tại');
        }
        if (!status) {
            return res.json('Thêm đầy đủ thông tin');
        }
        const orderUpdate = await Order.updateOne({ _id: id }, { $set: { status: status } });
        if (orderUpdate) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
        return res.json('Có lỗi khi sửa order');
    }
};

module.exports = { getOrderById, getOrder, addOrder, editOrder };
