# Feefo
![NodeJs](https://img.shields.io/badge/Node.Js-grey?style=flat-square&logo=node.js&logoColor=green&labelColor=black)
![Heroku](https://img.shields.io/badge/Heroku-grey?style=flat-square&logo=heroku&logoColor=white&labelColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-grey?style=flat-square&logo=mongoDb&logoColor=green&labelColor=black)

FeeFo is a easy to use and edit feedback survey form generator. Connect with your customers easily, using beautifully laid out forms. And create intuitive dashboards with a click of button.

### Application Status : Beta Testing 🧪
URL: [Feefo](https://feefo.herokuapp.com)

### App Instalation
This is a node backed application. So setting up is as easy as running
```js
npm install
```

> For Environment variables, setup a .env file using .env-sample as a blueprint

1. You would need a mongo-db url from [Mongo DB Atlas](https://cloud.mongodb.com/)
2. Google client ID from [Google developers console](https://console.developers.google.com/)
3. Session Secret Key - this could be a random string
4. Cookie Secret - This could be a random string too

### Dev Environment
For local dev setup, run the following
```js
npm run start-local
```

This will restart the server everytime there is a file-change. 

If there are any files that are to be excluded from nodemon watch list use ```ignore``` array in ```nodemon.json```

Install [Live Sass Compiler](https://marketplace.visualstudio.com/items?itemName=ritwickdey.live-sass) extension on Microsoft Visual Studio Code or equivalent alternative on your IDE for css.

### Session Management
Session is managed using [```session-file-store```](https://www.npmjs.com/package/session-file-store) package. It is a flat-file based session store.

### Deployment Status
![Heroku](https://heroku-badge.herokuapp.com/?app=feefo&style=flat)
