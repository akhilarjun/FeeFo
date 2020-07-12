const mongoose = require('mongoose');

const user = new mongoose.Schema({
    email: {
        required: true,
        type: String
    },
    userid: {
        required: true,
        type: String
    }
});

module.exports = User = mongoose.model('User', user);