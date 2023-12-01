const express = require('express');
const router = express.Router();
const orderCtrl = require('../controllers/OrderCtrl');
// const { authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware');

router.post('/add', orderCtrl.addOrder);
// router.get('/search', orderCtrl.getNews);
router.get('/all', orderCtrl.getOrder);
router.get('/:id', orderCtrl.getOrderById);
router.put('/edit/:id', orderCtrl.editOrder);
// router.delete('/delete', orderCtrl.deleteCart);

module.exports = router;
