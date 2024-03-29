const User = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// const refreshTokens = [];

const registerUser = async (req, res) => {
    try {
        const data = req.body;

        // Loi dinh dang email
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
        const isCheckEmail = reg.test(data.email);

        // const phoneNumberRegex = /^(?:\+84|0)(?:\d){9}$/;
        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[A-Z][a-zA-Z0-9!@#$%^&*]{7,16}$/;

        if (!data.username || !data.password || !data.email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Trường không được để trống',
            });
        } else if (!isCheckEmail) {
            return res.json({
                status: 'ERR',
                message: 'Email không hợp lệ!',
            });
        } else if (!passwordRegex.test(data.password)) {
            return res.json({
                status: 'ERR',
                message: 'Mật khẩu yếu!',
            });
        }

        const checkUser = await User.findOne({
            username: data.username,
        });

        const checkEmail = await User.findOne({
            email: data.email,
        });

        if (checkUser !== null || checkEmail !== null) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Thông tin tài khoản đã tồn tại',
            });
        }

        const hashed = bcrypt.hashSync(data.password, 10);

        const createdUser = await User.create({
            username: data.username,
            password: hashed,
            email: data.email,
        });
        if (createdUser) {
            return res.status(200).json({
                status: 'SUCCESS',
                createdUser
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            isAdmin: user.isAdmin,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: '1d' },
    );
};

// const generateRefreshToken = (user) => {
//     return jwt.sign(
//         {
//             id: user.id,
//             isAdmin: user.isAdmin,
//         },
//         process.env.JWT_REFRESH_KEY,
//         { expiresIn: '30d' },
//     );
// };

const loginUser = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            return res.json('Tài khoản hoặc mật khẩu không chính xác');
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        if (!validPassword) {
            return res.json('Tài khoản hoặc mật khẩu không chính xác');
        }

        if (user && validPassword) {
            //Generate access token
            const accessToken = generateAccessToken(user);

            //Generate refresh token
            // const refreshToken = generateRefreshToken(user);

            // refreshTokens.push(refreshToken);

            //STORE REFRESH TOKEN IN COOKIE
            // res.cookie('refreshToken', refreshToken, {
            //     httpOnly: true,
            //     secure: false,
            //     path: '/',
            //     sameSite: 'strict',
            // });
            const { password, isAdmin, ...others } = user._doc;

            return res.json({
                msg: 'SUCCESS',
                ...others,
                accessToken,
            });
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const getAllUser = async (req, res) => {
    try {
        const allUser = await User.find({ isAdmin: false });
        return res.status(200).json(allUser);
    } catch (error) {
        res.status(500).json(error);
    }
};

const getUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findById(id);

        const { password, isAdmin, ...others } = user._doc;

        return res.status(200).json({ ...others });
    } catch (error) {
        res.status(500).json(error);
    }
};

const editRoleStatus = async (req, res) => {
    try {
        const id = req.params.id;

        const { isAdmin, status } = req.body;
        console.log(req.body, id);
        const userUD = await User.findOneAndUpdate({ _id: id }, { $set: { isAdmin: isAdmin, status: status } }, { new: true }).exec();

        if (userUD) {
            return res.json({
                status: 'SUCCESS',
            });
        }
    } catch (error) {
        return res.json('Chỉnh sửa không hợp lệ');
    }
};

const changePassword = async (req, res) => {
    try {
        const { userId, oldPw, newPw } = req.body;

        if (!userId || !oldPw || !newPw) {
            return res.json({
                status: 'ERR',
                msg: 'Trường dữ liệu không được để trống!',
            });
        }

        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.json({
                status: 'ERR',
                msg: 'Tài khoản không hợp lệ!',
            });
        }
        const validPassword = await bcrypt.compare(oldPw, user.password);

        if (!validPassword) {
            return res.json({
                status: 'ERR',
                msg: 'Mật khẩu không chính xác!',
            });
        }

        const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[A-Z][a-zA-Z0-9!@#$%^&*]{7,16}$/;

        if (!passwordRegex.test(newPw)) {
            return res.json({
                status: 'ERR',
                msg: 'Mật khẩu yếu!',
            });
        }
        // console.log(req.body, validPassword);

        if (user && validPassword) {
            console.log(newPw);
            //Generate access token
            const hashed = bcrypt.hashSync(newPw, 10);
            const pwUpdated = await User.updateOne({ _id: req.body.userId }, { password: hashed });

            return res.json({
                msg: 'SUCCESS',
            });
        }
    } catch (error) {
        return res.json({
            status: 'ERR',
            msg: 'Thay đổi không hợp lệ',
            error,
        });
    }
};

module.exports = { registerUser, getUser, loginUser, getAllUser, editRoleStatus, changePassword };
