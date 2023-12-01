const mongoose = require('mongoose');

async function connect() {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(`${process.env.CONNECT}`);
        console.log('connect successffly');
    } catch (error) {
        console.log('connect fal');
    }
}

module.exports = { connect };
