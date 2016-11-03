/**
 * Created by vik on 01/11/16.
 */
"use strict";

const Debug = require('debug')('AUTH_MIDDLEWARE');

const Services = require('../../services');
const Constants = require('../../utils').Constants;


/**
 *
 * @param req
 * @param res
 * @param next
 */
const userAuth = function (req,res,next) {
    if(!req
        || !req.headers
        || (!req.headers.Authorization && !req.headers.authorization)
    ){
        return res.boom.unauthorized(null,'Bearer');
    }
    let authorization = req.headers.Authorization || req.headers.authorization;
    let parts = authorization.split(/\s+/);
    if (parts.length !== 2) {
        return res.boom.badRequest(Constants.ERROR_MESSAGES.BAD_AUTH_FORMAT, 'Bearer');
    }

    if (parts[0].toLowerCase() !== 'bearer') {
        return res.boom.unauthorized(null, 'Bearer');
    }
    var token = parts[1];
    Services.userService.getUser({accessToken : token},{},{limit : 1},(err,result) => {
        Debug(err,result);
        if(err || !result.length){
            return res.boom.unauthorized(Constants.ERROR_MESSAGES.INVALID_TOKEN,'Bearer');
        }
        req.cookies = {};
        req.cookies.user = result[0];
        next();
    });
};

module.exports = userAuth;