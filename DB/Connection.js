const mongoose = require('mongoose');
require('dotenv').config();

const URI = process.env.MONGO_DB_URI;

const connectDB = async () => {
    await mongoose.connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    console.log('=========|> DB Connection Established');
}

module.exports = connectDB;