const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const parser = require('body-parser');
const path = require('path');
const fs = require('fs');
const port = 8080;
const os = require('os');
const editJSONFile = require('edit-json-file');
const ifaces = os.networkInterfaces();
const authService = require('./session-minder.auth');
let runTime, answersDB, cookieId='feefo.choclate.cookie';

/**
 *  Get IPv4 Address of the System
 */
const getIPV4 = () => {
   let ipv4Address;
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
          if ('IPv4' !== iface.family || iface.internal !== false) {
            return;
          }
          ipv4Address = iface.address;
        });
    });
    return ipv4Address;
}

/**
 * @author https://gist.github.com/gordonbrander/2230317
 * 
 * Create a unique id everytime
 */
const genUID = () => {
    return Math.random().toString(36).substr(2,4)+'_'+Math.random().toString(36).substr(2,4)+'_'+Math.random().toString(36).substr(2,4);
}

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '')));
app.use(express.json());

app.use(session({
    store: new FileStore({}),
    secret: 'feefo akhil p arjun',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        expires: 600000,
        sameSite: true
    },
    name: cookieId
}));

sessionCheck = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        res.sendStatus(401);
    }
};

app.get('/web-uri', (req, res) => {
    res.end(uri);
});

app.get('/getsurveyqns/:forKey', (req, res) => {
    const response = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'feedback_config.json')
        )
    );
    let configFound = false;
    Object.keys(response).forEach(key => {
        const configList = response[key.replace('@','').replace('.','')].list;
        configList.forEach(config => {
            if (config.sharableURL === req.params.forKey) {
                configFound = true;
                let qns = editJSONFile(`${__dirname}/feedback-db/qnMap.json`);
                config.qns = qns.get(`${config.feedbackFor}qns`);
                res.send(config);
            }
        });
    });
    !configFound && res.send({
        status: 'FAILURE',
        msg: "Config not found!"
    });
});

app.get('/getconfig/:forKey', sessionCheck, (req, res) => {
    const response = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'feedback_config.json')
        )
    );
    const configList = response[req.session.user.email.replace('@','').replace('.','')].list;
    let configFound = false;
    configList.forEach(config => {
        if (config.feedbackFor === req.params.forKey) {
            configFound = true;
            let qns = editJSONFile(`${__dirname}/feedback-db/qnMap.json`);
            let qnList = qns.get(`${req.params.forKey}qns`);
            config.qns = qnList ? qnList : [];
            res.send(config);
        }
    });
    !configFound && res.send({
        status: 'FAILURE',
        msg: "Config not found!"
    });
});

app.get('/getconfig', sessionCheck, (req, res) => {
    const response = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'feedback_config.json')
        )
    );
    let configList = response[req.session.user.email.replace('@','').replace('.','')].list;
    if (!configList) {
        configList = [];
    }
    res.send(configList);
});

app.get('/getresponses/:forKey', sessionCheck, (req, res) => {
    let responses = JSON.parse(
        fs.readFileSync(
            path.join(__dirname, 'feedback-db/feedbacks.json')
        )
    );
    let feedbackList = [];
    Object.keys(responses).forEach(feedbackKey => {
        if (responses[feedbackKey].feedbackFor === req.params.forKey) {
            feedbackList.push(responses[feedbackKey]);
        }
    })
    res.send(feedbackList);
});

app.post('/submitFeedback', (req, res) => {
    let feedbackEntry = req.body;
    let creator = feedbackEntry.creator;
    delete feedbackEntry['creator'];
    //setting unique time-stamp as a identifier
    let id = 'feedback'+Date.now();
    feedbackEntry.id = id;
    answersDB = editJSONFile(`${__dirname}/feedback-db/feedbacks.json`);
    answersDB.set(id, feedbackEntry);
    answersDB.save();
    let feedbackConfig = editJSONFile(`${__dirname}/feedback_config.json`);
    config = feedbackConfig.get(creator.replace('@','').replace('.',''));
    config.list.forEach(survey => {
        if (survey.feedbackFor === feedbackEntry.feedbackFor) {
            survey.replyCount++;
        }
    });
    feedbackConfig.set(creator.replace('@','').replace('.',''), config);
    feedbackConfig.save();
    res.send({
        "status": "SUCCESS",
        "feedback_id": id
    });
});

app.post('/save-qn', sessionCheck, (req, res) => {
    let feedbackConfig = editJSONFile(`${__dirname}/feedback_config.json`);
    let qnMap = editJSONFile(`${__dirname}/feedback-db/qnMap.json`);
    let surveyInputQuestionare = req.body;
    surveyInputQuestionare.replyCount = 0;
    surveyInputQuestionare.version = 'v_'+Date.now();
    let inputFeedbackID = surveyInputQuestionare.feedbackFor;
    let oldId;
    if (inputFeedbackID) {
        oldId = inputFeedbackID;
        let qnmapObj = qnMap.toObject();
        delete qnmapObj[inputFeedbackID+'qns'];
        qnMap.write(JSON.stringify(qnmapObj));
    }
    if (!surveyInputQuestionare.sharableURL) {
        surveyInputQuestionare.sharableURL = genUID().replace(/_/g, '-');
    }
    inputFeedbackID = genUID();
    surveyInputQuestionare.feedbackFor = inputFeedbackID;
    qnMap.set(inputFeedbackID+'qns', surveyInputQuestionare.qns);
    surveyInputQuestionare.qns = inputFeedbackID+'qns';
    surveyInputQuestionare.userid = req.session.user.email;
    config = feedbackConfig.get(req.session.user.email.replace('@','').replace('.',''));
    if (!config) {
        config = {
            list: []
        };
    }
    let oldSurveyPlaceholderFound = false;
    config.list.forEach((surveyForm, surveyIndex) => {
        if (surveyForm.feedbackFor === oldId) {
            Object.keys(surveyForm).forEach(surveyformkey => {
                oldSurveyPlaceholderFound = true;
                surveyForm[surveyformkey] = surveyInputQuestionare[surveyformkey];
            });
        }
    });
    if (!oldSurveyPlaceholderFound) {
        config.list.push(surveyInputQuestionare);
    }
    feedbackConfig.set(req.session.user.email.replace('@','').replace('.',''), config);
    qnMap.save();
    feedbackConfig.save();
    res.send({
        "status": "SUCCESS",
        "feedback_id_for": inputFeedbackID
    });
});

app.post('/sign-in', (req, response) => {
    if (!req.session.user) {
        authService.verify(req.body.token)
        .then(res => {
            req.session.user = res;
            response.send(res);
        })
        .catch(console.error);
    } else {
        response.send(req.session.user);
    }
});

app.get('/sign-out', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        } else {
            res.clearCookie(cookieId);
            res.sendStatus(200);
        }
    });
});

app.get('/', (req, res) => {
    const destPath = path.join(__dirname, 'index.html');
    res.sendFile(destPath);
});

/**
 * Starts the express server
 * 
 * @param {boolean} [isLocal] - This parameter is optional. 
 * It is used to determine if the uri:port is displayed in console once
 * the application is up
 */
const runServer = (isLocal) => {
    uri = "http://"+getIPV4()+":"+port;
    app.listen(port, () => {
        isLocal && console.log("Server listening on "+uri);
    });
    return uri;
}

/**
 * Checks if the feedback-db folder exists and if not
 * create it for you, and also create a feedbacks.json file
 * so that the data can be persisted once spun-up
 */
const checkForFeedbackDbFile = () => {
    if (!fs.existsSync(`${__dirname}/feedback-db/feedbacks.json`)) {
        console.log('Folder not present for storing feedbacks');
        fs.mkdirSync(`${__dirname}/feedback-db`, {recursive: true}, (err) => {
            if (err) {
                throw('Feedbacks cannot be saved since directory does not exist. Kindly create a folder called "feedback-db"');
            }
        });
        console.log('Folder created for storing feedbacks');
        fs.writeFileSync(`${__dirname}/feedback-db/feedbacks.json`, '{}',  (err) => {
            if (err) {
                throw('Feedbacks cannot be saved since Feedback DB does not exist. Kindly create a file called "feedbacks.json" inside "feedback-db" folder');
            }
        })
        console.log("Feedbacks will now be saved in /feedback-db/feedbacks.json");
    } else {
        console.log("Feedbacks will now be saved in /feedback-db/feedbacks.json");
    }
}

process.argv.slice(2).forEach(arg => {
    const [key,value] = arg.split("=");
    runTime = value;
});

if (runTime == 'local') {
    checkForFeedbackDbFile();
    runServer(true);
}

module.exports = {
    run: runServer
}