"use strict";

// Module dependencies
const Async = require('async');
const Debug = require('debug')('USER_CONTROLLER');

const Services = require('../services');
const Helpers = require('../utils').Helpers;
const Constants = require('../utils').Constants;
const Socket = require('../lib/socket');

/**
 * Sign up a user
 * @param data
 * @param cb
 */
function signUp(data,cb){
    Async.series([
        function (done) {
            data.password = Helpers.createHash(data.password);
            Services.userService.createUser(data,(err,result) => {
                console.log(err,result);
                done(err,result);
            });
        }],(err,result) => {
        Debug(err,result);
        return cb(err,result);
    });
}

/**
 * login a user
 * @param data
 * @param cb
 */
function logIn(data,cb){
    let replyData = {};
    Async.waterfall([
        (done) => {
            Services.userService.getUser({email : data.email},{},{},done);
        },
        (user,done) => {
            if(!user || !user.length){
                return done(Helpers.createError(Constants.ERROR_MESSAGES.INVALID_USER));
            }
            data.password = Helpers.createHash(data.password);
            if(user[0].password !== data.password){
                return done(Helpers.createError(Constants.ERROR_MESSAGES.INVALID_PASSWORD));
            }
            let token = Helpers.createHash(new Date().toString());
            replyData.accessToken = token;
            Services.userService.updateUser({_id : user[0]._id},{accessToken : token},done);
        }
    ],(err,result) => {
        Debug(err,result);
        return cb(err,replyData);
    });
}

/**
 * Get users in the system
 * @param data
 * @param cb
 */
function getUsers(data,cb){
    Async.waterfall([
        (done) => {
            Services.userService.getUser({_id : {$ne : data.userId}},
                {firstName : 1,lastName : 1,favColor : 1,favPlace : 1},
                {},
                done);
        }
    ],(err,result) => {
        Debug(err,result);
        return cb(err,result);
    });
}

/**
 * Subscribe to the fields of a user
 * @param data
 * @param cb
 */
function subscribe(data,cb){
    Debug(data);
    Async.waterfall([
        (done) => {
            Services.userService.getUser({_id : data.userId},{},{},done);
        },
        (user,done) => {
            if(!user || !user.length){
                return done(Helpers.createError(Constants.ERROR_MESSAGES.INVALID_USER));
            }
            addSubscribeInfo(data,done);
        }
    ],(err,result) => {
        Debug(err,result);
        return cb(err,{});
    });
}

/**
 * update a user
 * @param data
 * @param cb
 */
function updateProfile(data,cb){
    Async.waterfall([
        (done) => {
            Services.userService.updateUser({_id : data.user._id},data,{},done);
        }
    ],(err,result) => {
        Debug(err,result);
        return cb(err,{});
    });
}

/**
 * update a user
 * @param data
 * @param cb
 */
function logOut(data,cb){
    Async.waterfall([
        (done) => {
            let update = {
              $unset : {accessToken : ''}
            };
            Services.userService.updateUser({_id : data.userId},update,{},done);
        },
        (result,done) => {
            Socket.emitEventToSocket(data.userId,Constants.EVENT_TYPES.DISCONNECT,{});
            Socket.delSocketId(data.userId);
            done();
        }

    ],(err,result) => {
        Debug(err,result);
        return cb(err,{});
    });
}

/**
 * Add subscription details in db
 * @internal
 * @param data
 * @param cb
 */
function addSubscribeInfo(data,cb){
    Async.waterfall([
        (done) => {
            var query = {
                _id : data.userId,
                'subscribers.user' : data.user._id
            };
            Services.userService.getUser(query,{},{},done);
        },
        (user,done) => {
            if(!user.length) {
                let update = {
                    $push : {
                        subscribers :{
                        user : data.user._id,
                        fields : data.fields
                    }}
                };
                Services.userService.updateUser({_id : data.userId},update,{},done);
            } else {
                let query = {
                    _id: data.userId,
                    'subscribers.user' : data.user._id
                };
                let update = {
                    $set : {
                        'subscribers.$' : {
                            user : data.user._id,
                            fields : data.fields
                        }
                    }
                };
                Services.userService.updateUser(query,update,{},done);
            }
        },
        (result,done) => {
            var query = {
                _id : data.user._id,
                'subscriptions.user' : data.userId
            };
            Services.userService.getUser(query,{},{},done);
        },
        (result,done) => {
            if(!result.length) {
                let update = {
                    $push : {
                        subscriptions :{
                            user : data.userId,
                            fields : data.fields
                        }}
                };
                Services.userService.updateUser({_id : data.user._id},update,{},done);
            } else {
                let query = {
                    _id: data.user._id,
                    'subscriptions.user' : data.userId
                };
                let update = {
                    $set : {
                        'subscriptions.$' : {
                            user : data.userId,
                            fields : data.fields
                        }
                    }
                };
                Services.userService.updateUser(query,update,{},done);
            }
        }
    ],(err,result) => {
        Debug("Error and result after updating subscribers",err,result);
        cb(err);
    });
}

module.exports = {
    signUp,
    logIn,
    getUsers,
    subscribe,
    updateProfile,
    logOut
};

