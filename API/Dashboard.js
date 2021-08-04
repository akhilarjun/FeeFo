const express = require('express');
const Feedback = require('../DB/models/Feedback');
const Survey = require('../DB/models/Survey');
const Questions = require('../DB/models/Questions');
const router = express.Router();

const excel = require("exceljs");

router.get('/:surveyId', async (req, res) => {
    try {
        let feedbackList = await Feedback.find().where({ feedbackFor: req.params.surveyId });
        res.status(200).json(feedbackList);
    } catch (error) {
        res.status(500).json(error);
    }
});

router.get('/downloadreport/:surveyId', async (req, res) => {
    try {
        let feedbackList = await Feedback.find().where({ feedbackFor: req.params.surveyId });
        let surveyRes = await Survey.findById(req.params.surveyId);
        let qnsList = await Questions.findOne({ qnForId: surveyRes._id });

        let feedbacks = [];
        feedbackList.forEach(f => {
            let feedbackObj = {};
            f.feedback.forEach(indFeedback => {
                let tokens = indFeedback.split('_');
                feedbackObj[tokens[1]] = tokens[2];
            });
            feedbacks.push(feedbackObj);
        });

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet(surveyRes.name);
        let columns = [];

        qnsList.qns.forEach((qn, index) => {
            let question = qn.statement;
            question = question.replace(/\\\n/g, '');
            question = question.trim();
            columns.push({
                header: question,
                key: index + 1
            });
        });
        worksheet.columns = columns;

        worksheet.addRows(feedbacks);

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + surveyRes.name.replace(/\s/g, '_') + ".xlsx"
        );
        workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        console.log(err)
        res.status(500).json(err);
    }
});

module.exports = router;