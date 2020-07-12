const express = require('express');
const Survey = require('../DB/models/Survey');
const Questions = require('../DB/models/Questions');
const Message = require('./Messages');
const router = express.Router();

router.get('/', async (req, res) => {
    let surveyList = await Survey.find().where({ createdBy: req.session.user.id });
    res.status(200).json(surveyList);
});

router.get('/:surveyId', async (req, res) => {
    try {
        let surveyRes = await Survey.findById(req.params.surveyId);
        if (!surveyRes) {
            res.status(409).json(Message.FAILURE('Survey Not Found'));
        } else {
            surveyRes = JSON.parse(JSON.stringify(surveyRes));
            let qnsList = await Questions.findOne({ qnForId: surveyRes._id });
            surveyRes['qns'] = qnsList['qns'];
            res.status(200).json(surveyRes);
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    const reqSurvey = req.body;
    reqSurvey.createdBy = req.session.user.id;
    const qnsList = reqSurvey.qns;
    delete reqSurvey.qns;
    let createdSurvey;
    try {
        let newSurvey = new Survey(reqSurvey);
        createdSurvey = await newSurvey.save();
        let questions = new Questions({
            qnForId: createdSurvey._id,
            qns: qnsList
        });
        await questions.save();
    } catch (err) {
        res.status(500).json(err);
    }
    res.status(201).json(Message.OK('Survey created succesfully', { surveyId: createdSurvey._id }));
});

router.post('/:surveyId', async (req, res) => {
    const reqSurvey = req.body;
    try {
        const updatedSurvey = await Survey.updateOne({ _id: req.params.surveyId }, {
            $set: {
                name: reqSurvey.name,
                description: reqSurvey.description,
                expiryDate: reqSurvey.expiryDate,
                replyCount: 0,
                needAdditionalComments: reqSurvey.needAdditionalComments,
                once: reqSurvey.once
            }
        });
        const updatedQns = await Questions.updateOne({ qnForId: req.params.surveyId }, {
            $set: {
                qns: reqSurvey.qns
            }
        });
        res.status(200).json(Message.OK('Updated Succesfully'));
    } catch (error) {
        res.status(500).json(error);
    }
});

router.delete('/:surveyId', async (req, res) => {
    try {
        await Survey.remove({ _id: req.params.surveyId });
        await Questions.remove({ qnForId: req.params.surveyId });
        res.status(204).json(Message.OK('Deleted Succesfully'));
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;