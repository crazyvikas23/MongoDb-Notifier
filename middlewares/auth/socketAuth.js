/**
 * Created by vik on 01/11/16.
 */
"use strict";

const Chalk = require('chalk');
const Debug = require('debug')('SOCKET_AUTH_MIDDLEWARE');

const Services = require('../../services');
const Constants = require('../../utils').Constants;

/**
 *
 * @param socket
 * @param next
 */
const userSocketAuth = function (socket,next) {
    Debug("Socket query params",Chalk.blue(socket.request._query.Authorization));
    if(!socket
        || !socket.request
        || !socket.request._query
        || !socket.request._query.Authorization
    ){
        return next(new Error(Constants.ERROR_MESSAGES.MISSING_AUTHORIZATION));
    }
    let token = socket.request._query.Authorization;
    Services.userService.getUser({accessToken : token},{},{limit : 1},(err,result) => {
        Debug(err,result);
        if(err || !result.length){
            return next(new Error(Constants.ERROR_MESSAGES.INVALID_TOKEN));
        }
        socket.user = result[0];
        next();
    });
};

module.exports = userSocketAuth;