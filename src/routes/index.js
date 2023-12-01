const userRouter = require('./UserRouter');
const newsRouter = require('./NewsRouter');
const productRouter = require('./ProductRouter')
const CartRouter = require('./CartRouter');
const OrderRouter = require('./OrderRouter');
// const ProductRouter = require('./ProductRouter');
// const categoryRouter = require('./category.router');

// const reviewRouter = require('./reviewRoure');

const routes = (app) => {
    app.use('/api/user', userRouter);
    app.use('/api/news', newsRouter);
    app.use('/api/product', productRouter);
    app.use('/api/cart', CartRouter);
    app.use('/api/order', OrderRouter);
    // app.use('/api/category', categoryRouter);
    // app.use('/api/review', reviewRouter);
};

module.exports = routes;