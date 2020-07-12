# Feefo
FeeFo is a easy to use and edit feedback survey form generator. Connect with your customers easily, using beautifully laid out forms. And create intuitive dashboards with a click of button.

## App Instalation
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
```js
npm run start-local
```

Run ```start-local``` script to start a nodemon script, that will restart the server everytime there is a file-change. If there are any files that are to be excluded from nodemon watch list use ```ignore``` array in ```nodemon.json```

### Session Management
Session is managed using ```session-file-store``` package. It is a flat-file based session store.