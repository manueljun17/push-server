'use strict';

var firebase = require('firebase');

var myConfig = require('./config');

const express = require('express');

const bodyParser = require('body-parser');

const webpush = require('web-push');

const app = express();

firebase.initializeApp( myConfig.config ); 

var db = firebase.database();

var subscribers = db.ref('/subscriber');



 var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' == req.method) res.send(200);
    else next();
};
app.use(allowCrossDomain);
app.use(bodyParser.json());
  app.post('/api/trigger-push-msg/', function ( req, res ) {
      var dataToSend = req.query.message;
      getSubscriptionsFromDatabase().then(function( subscriptions ){
        var promiseChain = Promise.resolve( subscriptions );
        promiseChain = promiseChain.then( function( data ) {
            data.forEach( function( subscription ) {
                return triggerPushMsg( subscription, dataToSend);
            }, this);
        });
        return promiseChain;
        }).then( function() {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        })
        .catch(function(err) {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
            error: {
                id: 'unable-to-send-messages',
                message: `We were unable to send messages to all subscriptions : ` +
                `'${err.message}'`
            }
            }));
        });;
  });

const triggerPushMsg = function(subscription, dataToSend) {
    return webpush.sendNotification(subscription, dataToSend, myConfig.options )
    .catch((err) => {
        if (err.statusCode === 410) {
            return deleteSubscriptionFromDatabase(subscription._id);
        } else {
            console.log('Subscription is no longer valid: ', err);
        }
    });
};
function getSubscriptionsFromDatabase() {
    return new Promise(function(res,err) {
        subscribers.on('value',function ( data ) {
            var list = [];
            var val = data.val();
            var keys = [];
            if( val ) keys = Object.keys( val );
            for( var i=0; i < keys.length; i++ ) {
                var k = keys[i];
                var subscr = JSON.parse(val[k]);
                subscr['_id'] = k;
                list.push( subscr );
            }
            return res(list);
        }, err );
    });
}
function errData( err ) {
    console.log( "Error!!" );
    console.log( err );
}
function deleteSubscriptionFromDatabase( key ) {
    subscribers.child(key).remove();
}

const server = app.listen(process.env.PORT || '8080', () => {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});