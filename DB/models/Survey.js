const mongoose = require('mongoose');

/**
 * @author https://gist.github.com/gordonbrander/2230317
 * 
 * Create a unique id everytime
 */
const genUID = () => {
    return Math.random().toString(36).substr(2,4)+'-'+Math.random().toString(36).substr(2,4)+'-'+Math.random().toString(36).substr(2,4);
}

const surveySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    expiryDate: {
        type: Date,
        required: false
    },
    replyCount: {
        type: Number,
        required: true,
        default: 0
    },
    sharableURL: {
        type: String,
        required: true,
        default: genUID()
    },
    createdBy: {
        type: String,
        required: true
    },
    needAdditionalComments: {
        type: Boolean,
        required: true,
        default: false
    },
    once: {
        type: Boolean,
        required: true,
        default: false
    }
});

module.exports = Survey = mongoose.model('Survey', surveySchema);