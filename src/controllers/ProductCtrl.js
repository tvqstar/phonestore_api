const Product = require('../models/ProductModel');
const Category = require('../models/CategoryModel');
const fs = require('fs');

const { unlink } = require('fs/promises');

const path = require('path');

const getCategory = async (req, res) => {
    try {
        const cate = await Category.find({});
        return res.status(200).json(cate);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const addCategory = async (req, res) => {
    try {
        const checkCate = await Category.findOne({
            name: req.body.name,
        });
        if (checkCate !== null) {
            return res.json('Danh mục đã tồn tại');
        }

        const createCategory = await Category.create({
            name: req.body.name,
        });
        if (createCategory) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const editCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const name = req.body.name;

        if (!id || !name) {
            return res.json('Thất bại!');
        }

        const editCategory = await Category.findOneAndUpdate({ _id: id }, { name: name });

        if (editCategory) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
        return res.json('Chỉnh sửa không hợp lệ');
    }
};

const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;
        const CategoryDelete = await Category.findOneAndDelete({ _id: id });
        if (CategoryDelete) {
            return res.status(200).json('Xoá thành công!');
        }
        return res.status(200).json('Xoá that bai!');
    } catch (error) {
        return res.json('Xoá thất bại!');
    }
};

// Product  Product Product Product Product

const getAllProduct = async (req, res) => {
    try {
        const allProduct = await Product.find({}).populate({ path: 'category', select: 'name' }).exec();
        return res.status(200).json(allProduct);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getSortProduct = async (req, res) => {
    try {
        const sort = req.query.sort;
        const products = await Product.find()
            .sort({ price: sort == 1 ? 1 : -1 })
            .exec();
        return res.status(200).json(products);
    } catch (error) {
        return res.status(500).json(error);
    }
};

const getProductByName = async (req, res) => {
    try {
        const name = req.query.name;
        const products = await Product.find({ name: { $regex: new RegExp(name, 'i') } });

        if (products) {
            return res.json({
                status: 'SUCCESS',
                products,
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const addProduct = async (req, res) => {
    try {
        const { name, slug, category, description, price, colors } = req.body;
        const fileData = req.file;

        if (!name || !slug || !category || !description || !price || !fileData) {
            if (fileData) await unlink(`${fileData?.path}`);
            return res.json({
                msg: 'Không được để trống!',
            });
        }
        const checkProduct = await Product.find({ $or: [{ name }, { slug }] });

        if (checkProduct?.length > 0) {
            if (fileData) await unlink(`${fileData?.path}`);
            return res.json({
                msg: 'Sản phẩm trùng tên',
            });
        }

        const newProduct = new Product({
            name,
            slug,
            category,
            description,
            price,
            colors,
            image: fileData?.filename,
        });

        const product = await newProduct.save();

        return res.json({
            status: 'SUCCESS',
            product,
        });
    } catch (error) {
        if (req.file) {
            await unlink(`${req.file.path}`);
        }
        return res.status(500).json(error);
    }
};

const editProduct = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, slug, category, description, price, colors } = req.body;
        const fileData = req?.file;

        const check = await Product.findOne({ _id: id });
        if (!check) {
            return res.json('Sản phẩm không hợp lệ!');
        }

        if (!name || !slug || !category || !description || !price) {
            if (fileData) await unlink(`${fileData?.path}`);
            return res.json({
                msg: 'Trường dữ liệu không được để trống!',
            });
        }
        const checkProduct = await Product.find({ $or: [{ name }, { slug }] });

        const checkById = checkProduct.filter((prod) => prod._id != id);
        if (checkById?.length > 0) {
            if (fileData) await unlink(`${fileData?.path}`);
            return res.json('Sản phẩm trùng tên');
        }

        const productUpdate = await Product.findByIdAndUpdate(
            { _id: id },
            { name, slug, category, description, price, colors, image: fileData?.filename },
        );

        const product = await productUpdate.save();

        return res.json({
            status: 'SUCCESS',
            product,
        });
    } catch (error) {
        if (req?.file) {
            await unlink(`${req.file.path}`);
        }
        return res.status(500).json(error);
    }
};

const onlyEditQty = async (req, res) => {
    try {
        const { proId, qty, colorId } = req.body;

        const productUpdated = await Product.findOneAndUpdate(
            { _id: proId, 'colors._id': colorId },
            { $set: { 'colors.$.inStock': qty } },
            { new: true },
        ).exec();

        if (productUpdated) {
            return res.json({
                status: 'SUCCESS',
                productUpdated,
            });
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        // const news = await News.findById(id);
        const productDelete = await Product.findOneAndDelete({ _id: id });
        if (productDelete) {
            return res.json({
                status: 'SUCCESS',
            });
        }
        return res.json('Xoá that bai!');
    } catch (error) {
        return res.json('Xoá thất bại!');
    }
};

const getImageProd = async (req, res) => {
    // const uploadDir = path.join(__dirname, '../../', 'uploads/');

    const filePath = path.join(__dirname, '../../', 'uploads/', req.params.filename);
    if (fs.existsSync(filePath)) {
        // Tệp tin tồn tại, gửi ảnh về cho người dùng
        // res.sendFile(filePath);
        return res.sendFile(filePath);
    } else {
        // Tệp tin không tồn tại, trả về lỗi hoặc ảnh mặc định
        return res.status(404).send('Không tìm thấy ảnh');
    }
};

module.exports = {
    getCategory,
    addCategory,
    editCategory,
    deleteCategory,
    getAllProduct,
    getSortProduct,
    getProductByName,
    addProduct,
    editProduct,
    onlyEditQty,
    deleteProduct,
    getImageProd,
};
