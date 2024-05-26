// We are now using the database. So, we need to connect to it at startup. You need a file, db/connect.js. Check that it looks like the following:

const mongoose = require('mongoose');

const connectDB = (url) => {
    return mongoose.connect(url, {});
};

module.exports = connectDB;
