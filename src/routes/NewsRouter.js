const express = require('express');
const router = express.Router();
const newsControllers = require('../controllers/NewsCtrl');
const { authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware');
const uploadImage = require('../middleware/uploadImage');

router.post('/add', uploadImage.single('image'), newsControllers.addNews);
router.get('/search', newsControllers.getNews);
router.get('/allNews', newsControllers.getAllNews);
router.put('/edit/:id', uploadImage.single('image'), newsControllers.editNews);
router.delete('/delete/:id', newsControllers.deleteNews);
router.get('/image/:filename', newsControllers.getImageNews);

module.exports = router;