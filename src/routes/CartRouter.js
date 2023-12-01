const express = require('express');
const router = express.Router();
const cartCtrl = require('../controllers/CartCtrl');
// const { authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware');

router.post('/add', cartCtrl.addCart);
// router.get('/search', cartCtrl.getNews);
router.get('/get-cart/:id', cartCtrl.getCart);
router.post('/edit', cartCtrl.editCart);
router.post('/delete', cartCtrl.deleteCart);

module.exports = router;
