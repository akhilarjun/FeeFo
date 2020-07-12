const express = require('express');
const Feedback = require('../DB/models/Feedback');
const router = express.Router();

router.get('/:surveyId', async (req, res) => {
    try {
        let feedbackList = await Feedback.find().where({ feedbackFor: req.params.surveyId });
        res.status(200).json(feedbackList);
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;