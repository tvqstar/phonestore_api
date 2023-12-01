const express = require('express');
const router = express.Router();
const productController = require('../controllers/ProductCtrl');
const uploadImage = require('../middleware/uploadImage');
// const { authMiddleWare } = require('../middleware/authMiddleware');

router.get('/category', productController.getCategory);
router.post('/add-category', productController.addCategory);
router.put('/edit-category/:id', productController.editCategory);
router.delete('/delete-category/:id', productController.deleteCategory);

router.get('/get-product', productController.getAllProduct);
router.get('/search', productController.getProductByName);
router.get('/image/:filename', productController.getImageProd);
router.post('/add-product', uploadImage.single('image'), productController.addProduct);
router.post('/edit/:id', uploadImage.single('image'), productController.editProduct);
router.delete('/delete/:id', productController.deleteProduct);
// router.get('/search', productController.searchProductByName);
// router.get('/product-category/:id', productController.getProductByCategory);

module.exports = router;
