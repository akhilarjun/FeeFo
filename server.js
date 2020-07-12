const express = require('express');
const app = express();
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const path = require('path');
const port = process.env.PORT || 8080;
const os = require('os');
const ifaces = os.networkInterfaces();
const authService = require('./API/session-minder.auth');
const connectDB = require('./DB/Connection');
const User = require('./DB/models/User');
const SurveyRouter = require('./API/Survey');
const FeedbackRouter = require('./API/Feedback');
const DashboardRouter = require('./API/Dashboard');
let runTime, cookieId;
require('dotenv').config();

cookieId = process.env.COOKIE_SECRET

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


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '')));
app.use(express.json());

app.use(session({
    store: new FileStore({}),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        expires: 60000 * 5,
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

app.use('/survey', sessionCheck, SurveyRouter);
app.use('/feedback', FeedbackRouter);
app.use('/dashboard', sessionCheck, DashboardRouter);

app.get('/web-uri', (req, res) => {
    res.end(uri);
});

app.post('/sign-in', async (req, response) => {
    if (!req.session.user) {
        const verifiedUSer = await authService.verify(req.body.token);
        console.info(`User verified from Authservice!`);
        req.session.user = verifiedUSer;
    }
    let mongoUser = await User.findOne({ email: req.session.user.email });
    if (!mongoUser) {
        console.log('Creating record for ' + req.session.user.name);
        let newUSer = new User({
            email: req.session.user.email,
            userid: req.session.user.id
        });
        mongoUser = await newUSer.save();
    }
    req.session.user.id = mongoUser._id;
    response.send(req.session.user);
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
const runServer = async () => {
    console.log(`=========|> Starting Feefo Server`);
    await connectDB();
    uri = "http://" + getIPV4() + ":" + port;
    app.listen(port, () => {
        console.log(`=========|> Server listening on ${uri}`);
    });
    return uri;
}

runServer(true);