const express = require('express');
const Survey = require('../DB/models/Survey');
const Questions = require('../DB/models/Questions');
const Message = require('./Messages');
const Feedback = require('../DB/models/Feedback');
const router = express.Router();

router.get('/:sharableURL', async (req, res) => {
    try {
        let surveyRes = await Survey.findOne({ sharableURL: req.params.sharableURL });
        if (!surveyRes) {
            res.status(409).json(Message.FAILURE('Survey Not Found'));
        } else {
            surveyRes = JSON.parse(JSON.stringify(surveyRes));
            let qnsList = await Questions.findOne({ qnForId: surveyRes._id });
            surveyRes['qns'] = qnsList['qns'];
            res.status(200).json(surveyRes);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/:sharableURL', async (req, res) => {
    try {
        let surveyRes = await Survey.findOne({ sharableURL: req.params.sharableURL });
        await Survey.updateOne({ sharableURL: req.params.sharableURL }, {
            $set: {
                replyCount: ++surveyRes.replyCount
            }
        });
        if (!surveyRes) {
            res.status(409).json(Message.FAILURE('Survey Not Found'));
        } else {
            let feedbackFromReq = req.body;
            feedbackFromReq.feedbackFor = surveyRes._id;
            let feedback = new Feedback(feedbackFromReq);
            let savedFeedback = await feedback.save();
            res.status(200).json(Message.OK('Feedback Submitted', { feedbackFor: surveyRes._id }));
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

module.exports = router;