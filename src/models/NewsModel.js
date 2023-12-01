const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
    },
    {
        timestamps: true,
    },
);
const News = mongoose.model('TinTuc', newsSchema);
module.exports = News;
