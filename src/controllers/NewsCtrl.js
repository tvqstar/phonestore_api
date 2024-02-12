const News = require('../models/NewsModel');

const fs = require('fs');
const { unlink } = require('fs/promises');
const path = require('path');

const getAllNews = async (req, res) => {
    try {
        const allNews = await News.find({});
        return res.status(200).json(allNews);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getNews = async (req, res) => {
    try {
        const title = req.query.title;
        const news = await News.find({ title: { $regex: `${title}` } });
        console.log(news);

        return res.status(200).json(news);
    } catch (error) {
        res.status(500).json(error);
    }
};

const addNews = async (req, res) => {
    try {
        const { title, content } = req.body;
        const fileData = req.file;

        if (!title || !content || !fileData) {
            if (fileData) await unlink(`${fileData?.path}`);
            return res.json({
                msg: 'Không được để trống!',
            });
        }
        const news = await News.create({
            title: title,
            content: content,
            image: fileData?.filename,
        });
        if (news) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
        if (req.file) {
            await unlink(`${req.file.path}`);
        }
        return res.json('Chỉnh sửa không hợp lệ');
    }
};

const editNews = async (req, res) => {
    try {
        const id = req.params.id;
        const { title, content } = req.body;
        const fileData = req.file;

        if (!title || !content) {
            if (fileData) await unlink(`${fileData?.path}`);
            return res.json({
                msg: 'Không được để trống!',
            });
        }

        const newsUpdated = await News.findOneAndUpdate({ _id: id }, { title: title, content: content, image: fileData?.filename });

        if (newsUpdated) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
        if (req.file) {
            await unlink(`${req.file.path}`);
        }
        return res.json('Chỉnh sửa không hợp lệ');
    }
};

const deleteNews = async (req, res) => {
    try {
        const id = req.params.id;
        // const news = await News.findById(id);
        const newsDelete = await News.findOneAndDelete({ _id: id });
        if (newsDelete) {
            return res.json({
                status: 'SUCCESS',
                cartUpdated,
            });
        }
        return res.status(200).json('Xoá that bai!');
    } catch (error) {
        return res.json('Xoá thất bại!');
    }
};

const getImageNews = async (req, res) => {
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

module.exports = { getAllNews, getNews, addNews, editNews, deleteNews, getImageNews };
