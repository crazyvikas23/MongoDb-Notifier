"use strict";

/**
 * Created by vik on 03/11/16.
 */
const Async = require('async');
const _ = require('underscore');
const Debug = require('debug')('USER_NOTIFIER');
const Chalk = require('chalk');

const Services = require('../services');
const Socket = require('./socket');
const updateEmitter = require('./mongoWatcher');
const Constants = require('../utils').Constants;

updateEmitter.on('data',(doc) => {
    Debug(Chalk.green(doc));
    doc = doc.toObject();
    if(!doc.o2 || !doc.o2._id || !doc.o || !doc.o.$set){
        return;
    }
    let user = {
        docId : doc.o2._id,
        updatedKeys : doc.o.$set
    };
    Async.waterfall([
        (done) => {
            Services.userService.getUser({_id : user.docId},{subscribers : 1,firstName : 1,lastName : 1},{lean : true},done);
        },
        (userDetails,done) => {
            Debug(Chalk.blue(userDetails));
            if(!userDetails || !userDetails.length){
                return done(new Error('INVALID_USER'));
            }
            Async.each(userDetails[0].subscribers,(subs,callback) => {
                let subsKeys = subs.fields;     // subscribed keys
                let emitKeys = _.intersection(subsKeys, _.keys(user.updatedKeys)); // keys to emit to user
                if(!emitKeys.length){
                    return callback(new Error('NO_KEYS_TO_SEND_UPDATES'));
                }
                let emitObj = _.pick(user.updatedKeys,(val,key) => {        // Create key val obj
                    return emitKeys.includes(key);
                });
                emitObj.user = {
                    firstName: userDetails[0].firstName,
                    lastName: userDetails[0].lastName
                };
                notifyUser({userId : subs.user,emitObj : emitObj},callback);
            },(err) => {
                done(err);
            });
        }
    ],(err,result) => {
        Debug("Error and result after notifying",err,result);
    });
});

function notifyUser(data,cb){
    Socket.emitEventToSocket(data.userId,Constants.EVENT_TYPES.FIELDS_UPDATED,data.emitObj,cb);
}