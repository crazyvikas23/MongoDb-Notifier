"use strict";

/**
 * Created by vik on 02/11/16.
 */
const Crypto = require('crypto');

const Constants = require('./constants');

/**
 * Create success object
 * @param success
 * @param statusCode
 * @param data
 * @returns {*}
 */
function createSuccessResponse(success,statusCode,data){
    var reply = {};
    if(typeof success === 'object' && success.response && success.statusCode){
        return success;
    }
    if(typeof success === 'object'){
        reply.response =  {
            message : Constants.SUCCESS_MESSAGES.DEFAULT_MESSAGE,
            status : statusCode || Constants.STATUS_CODES.DEFAULT_SUCCESS,
            data : success
        };
        reply.statusCode = statusCode || Constants.STATUS_CODES.DEFAULT_SUCCESS;
        return reply;
    }
    if(typeof success === 'string'){
        reply.response =  {
            message : success,
            status : statusCode || Constants.STATUS_CODES.DEFAULT_SUCCESS,
            data : data || {}
        };
        reply.statusCode = Constants.STATUS_CODES.DEFAULT_SUCCESS;
        return reply;
    }
    // Default success response
    reply.response = {
        message : Constants.SUCCESS_MESSAGES.DEFAULT_MESSAGE,
        status : 200,
        data : success || {}
    };
    reply.statusCode = Constants.STATUS_CODES.DEFAULT_SUCCESS;
    return reply;
}
/**
 * Create error response
 * @param err
 * @param statusCode
 * @param type
 * @returns {*}
 */
function createError(err,statusCode,type){
    var reply = {};
    if(typeof err === 'object' && err.response && err.statusCode){
        return err;
    }
    if(err.isJoi){
        reply.response = {
            message : (err.details[0] && err.details[0].message).replace(/\"/g,'') || Constants.ERROR_MESSAGES.DEFAULT_MESSAGE,
            status : Constants.STATUS_CODES.VALIDATION_ERROR,
            type : err.name,
            data : {}
        };
        reply.statusCode = Constants.STATUS_CODES.VALIDATION_ERROR;
        return reply;
    }
    if(err.name === 'MongoError'){
        reply.response = {
            message : ' ',
            status : Constants.ERROR_MESSAGES.DUPLICATE_VALUE.
                        replace('{key}',err.message.slice(err.message.lastIndexOf('index: ') + 7,err.message.indexOf('_'))),
            type : 'DuplicateValue',
            data : {}
        };
        reply.statusCode = Constants.STATUS_CODES.VALIDATION_ERROR;
        return reply;
    }
    if(typeof err === 'object' && err.message && err.statusCode){
        reply.response = err;
        reply.response.type = err.type || 'BadRequest';
        reply.statusCode = err.statusCode;
        return reply;
    }
    if(typeof err === 'string'){
        reply.response = {
            message : err,
            status : statusCode || Constants.STATUS_CODES.BAD_REQUEST,
            type : 'BadRequest',
            data : {}
        };
        reply.statusCode = Constants.STATUS_CODES.VALIDATION_ERROR;
        return reply;
    }
    reply.response = {
        message : Constants.ERROR_MESSAGES.DEFAULT_MESSAGE,
        status : Constants.STATUS_CODES.DEFAULT_ERROR,
        type : 'UnknownError',
        data : {}
    };
    reply.statusCode = Constants.STATUS_CODES.VALIDATION_ERROR;
    return reply;
}

function createHash(data,algorithm){
    if(!data){
        return 'DUMMY';
    }
    data = data.toString();
    let hash = Crypto.createHash(algorithm || 'sha256');
    return hash.update(data).digest('base64');
}

module.exports = {
    createSuccessResponse,
    createError,
    createHash
};