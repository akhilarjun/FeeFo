const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    qnForId : {
        type: String,
        required: true
    },
    qns : [{
        statement : {
            type: String,
            required: true
        },
        type : {
            type: String,
            required: true
        },
        requireValidation : {
            type: Boolean,
            required: true
        },
        optionsList : {
            type: [String],
            required: true,
            default: []
        }
    }],
});

module.exports = Questions = mongoose.model('Questions', questionSchema);