const News = require('../models/NewsModel');

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
    const data = req.body;

    if (!data.title || !data.content) {
        return res.json('Thêm đầy đủ thông tin');
    }
    const news = await News.create({
        title: data.title,
        content: data.content,
    });
    if (news) {
        return res.json({
            status: 'SUCCESS',
        });
    }
};

const editNews = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const newsUpdated = await News.findOneAndUpdate({ _id: id }, data);

        if (newsUpdated) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
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

module.exports = { getAllNews, getNews, addNews, editNews, deleteNews };
