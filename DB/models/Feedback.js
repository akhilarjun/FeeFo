const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedback: {
        type: [String],
        required: true
    },
    additionalComments: {
        type: String,
        required: false
    },
    feedbackFor: {
        type: String,
        required: true
    }
});

module.exports = Feedback = mongoose.model('Feedback', feedbackSchema);