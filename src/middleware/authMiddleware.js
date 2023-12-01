const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'Không đủ quyền',
        });
    }
    const token = req.headers.token.split(' ')[1];
    jwt.verify(token, process.env.JWT_ACCESS_KEY, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: 'The authorization',
                status: 'ERROR',
            });
        }
    });
};

const authUserMiddleWare = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(401).json({
            message: 'Không đủ quyền',
        });
    }
    const token = req.headers.token.split(' ')[1];
    const userId = req.params.id;

    // const decoded = jwt.verify(token, process.env.JWT_ACCESS_KEY)
    // if(decoded.exp > Date.now() / 1000) {
    //     console.log('haha');
    // } else {
    //     console.log('hehe');
    // }

    jwt.verify(token, process.env.JWT_ACCESS_KEY, function (err, user) {
        if (err) {
            return res.status(401).json({
                message: 'The authentication',
                status: 'ERROR',
            });
        }
        if (user?.isAdmin || user?.id === userId) {
            req.user = user;
            next();
        } else {
            return res.status(403).json({
                message: 'The authorization',
                status: 'ERROR',
            });
        }
    });
};

module.exports = {
    authMiddleWare,
    authUserMiddleWare,
};
