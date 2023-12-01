const express = require('express');
const router = express.Router();
const newsControllers = require('../controllers/NewsCtrl');
const { authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware');

router.post('/add', newsControllers.addNews);
router.get('/search', newsControllers.getNews);
router.get('/allNews', newsControllers.getAllNews);
router.put('/edit/:id', newsControllers.editNews);
router.delete('/delete/:id', newsControllers.deleteNews);

module.exports = router;