'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');

const app = express();

const options = {
    vapidDetails: {
        subject: 'http://localhost:4200',
        publicKey: 'BNzNJai0BhWggRnf4ehKwHXLB9q_1At6mfw-mLzB2ieE-bgLdhl1HuDdJ70SH80nUkSOJtbZqOVjgLXlFXme2h0',
        privateKey: 'daCTs_ipLIAKyOfk_cMfWp3sW2vROj5RTrkALA8usEM'
    },
    TTL: 60 * 60
};
const subscription = {"endpoint":"https://fcm.googleapis.com/fcm/send/cE4LYi4pU5Q:APA91bFwVRfRYFNPG6RKfSTSJ1n6ObHD7hutyNSghbOJvFQL6Vkcw0l_TFfKdLawRBMGtUW-tl_IG6w2J9mbmEXz4dfx5YqIYP1z4BQiX1rlHlhd2Zep4cjuwM8QpoO6vA6KJaKa2Dfy","keys":{"p256dh":"BFePJuO97zJk2agDf70w-shWvIlEk_tQuY308znMLJ3pIuFcGzTsaqz-e-WE-KGWXApWvwo6hJ13lwKe_g-Ayug=","auth":"pNF7iUalvzr1gVYp_bbsCg=="}};
 var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

        // intercept OPTIONS method
        if ('OPTIONS' == req.method) {
        res.send(200);
        }
        else {
        next();
        }
    };
  app.use(allowCrossDomain);
app.use(bodyParser.json());
  app.post('/api/trigger-push-msg/', function (req, res) {
      console.log("req:",req.query.message);
      var dataToSend = req.query.message;
      triggerPushMsg(subscription, dataToSend);
      res.end();
  });

const triggerPushMsg = function(subscription, dataToSend) {
return webpush.sendNotification(subscription, dataToSend,options)
.catch((err) => {
    if (err.statusCode === 410) {
    return deleteSubscriptionFromDatabase(subscription._id);
    } else {
    console.log('Subscription is no longer valid: ', err);
    }
 });
};

const server = app.listen(process.env.PORT || '8080', () => {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});