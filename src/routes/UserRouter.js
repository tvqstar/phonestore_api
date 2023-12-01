const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/UserCtrl');
const { authMiddleWare, authUserMiddleWare} = require('../middleware/authMiddleware');

router.post('/register', userControllers.registerUser);
router.post('/login', userControllers.loginUser);
router.get('/allUser', userControllers.getAllUser);// get all user
router.get('/:id', userControllers.getUser); //get user by id
router.put('/edit/:id', userControllers.editRoleStatus);

// router.get('/allUser', authMiddleWare, userControllers.getAllUser);// get all user
// router.get('/:id', authUserMiddleWare, userControllers.getUser); //get user by id

module.exports = router;
