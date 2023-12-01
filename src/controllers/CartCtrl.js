const Cart = require('../models/CartModel');

const getCart = async (req, res) => {
    try {
        const id = req.params.id;
        const cart = await Cart.findOne({ user: id });
        return res.json(cart);
    } catch (error) {
        return res.json('Có lỗi');
    }
};

const addCart = async (req, res) => {
    try {
        const { id, items } = req.body;
        if (!id || !items) {
            return res.json('Thêm đầy đủ thông tin');
        }

        // console.log(items);

        const checkCart = await Cart.findOne({ user: id });
        if (checkCart) {
            const checkProd = checkCart.items.filter((item) => item.productId == items.productId);

            if (checkProd) {
                // Đã có id sản phẩm
                const checkColor = checkProd.every((prod) => {
                    return prod.color !== items.color;
                });
                if (!checkColor) {
                    // Thêm sản phẩm cùng id và cùng màu
                    return res.json({
                        msg: 'Sản phẩm đã tồn tại',
                    });
                } else {
                    // Thêm sản phẩm cùng id nhưng khác màu - thêm bình thường
                    const cartUpdated = await Cart.findOneAndUpdate({ user: id }, { $push: { items: items } }, { new: true }).exec();
                    return res.json({
                        status: 'SUCCESS',
                        cartUpdated,
                    });
                }
            } else {
                // Chưa có id sản phẩm trong giỏ hàng
                const cartUpdated = await Cart.findOneAndUpdate({ user: id }, { $push: { items: items } }, { new: true }).exec();
                return res.json({
                    status: 'SUCCESS',
                    cartUpdated,
                });
            }
        }

        const cart = await Cart.create({
            user: id,
            items: items,
        });
        if (cart) {
            return res.status(200).json({
                status: 'SUCCESS',
                cart,
            });
        }
    } catch (error) {
        return res.json(error);
    }
};

const editCart = async (req, res) => {
    try {
        const { id, qty, product_Id } = req.body;

        // const checkCart = await Cart.findOne({ user: id });
        // if(checkCart) {
        //     const checkItem = checkCart.items.every((item) => {
        //         return item._id != product_Id;
        //     });

        // }
        const cartUpdated = await Cart.findOneAndUpdate(
            { user: id, 'items._id': product_Id },
            { $set: { 'items.$.quantity': qty } },
            { new: true },
        ).exec();
        if (cartUpdated) {
            return res.json({
                status: 'SUCCESS',
                cartUpdated,
            });
        }
    } catch (error) {
        return res.json('Chỉnh sửa không hợp lệ');
    }
};

const deleteCart = async (req, res) => {
    try {
        const { id, product_Id } = req.body;
        const deleteProd = await Cart.findOneAndUpdate({ user: id }, { $pull: { items: { _id: product_Id } } }, { new: true }).exec();

        if (!deleteProd) {
            return res.status(200).json('Co loi xay ra');
        }
        return res.json({
            status: 'SUCCESS',
        });
    } catch (error) {
        return res.json(error);
    }
};

module.exports = { getCart, addCart, editCart, deleteCart };
