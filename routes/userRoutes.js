/**
 * Created by vik on 02/11/16.
 */
"use strict";

const Express = require('express');
const Joi = require('joi');
const Debug = require('debug')('USER_ROUTES');
const Async = require('async');

const Middlewares = require('../middlewares');
const userController = require('../controllers/user');
const Constants = require('../utils').Constants;
const Helpers = require('../utils').Helpers;
const Router = Express.Router();

/**
 * Sign up a user
 */
Router.post('/signUp', (req,res) => {
    let signUpSchema = {
        email: Joi.string().email().required(),
        phoneNo : Joi.string().length(10).required(),
        password : Joi.string().required(),
        firstName : Joi.string().required().trim().lowercase(),
        lastName : Joi.string().required().trim().lowercase(),
        favColor : Joi.string().required().trim().lowercase(),
        favPlace : Joi.string().required().trim().lowercase()
    };
    Async.waterfall([
        (done) => {
            Joi.validate(req.body,signUpSchema,{},(err,result) => {
                done(err,result);
            });
        },
        (value,done) => {
            Debug("Payload from Joi validation",value);
            userController.signUp(value,done);
        }
    ],(err,result) => {
        Debug("Error and result",err,result);
        var reply;
        if(err){
            reply = Helpers.createError(err);
            return res.status(reply.statusCode).send(reply.response);
        }
        reply = Helpers.createSuccessResponse(result);
        return res.status(reply.statusCode).send(reply.response);
    });
});

/**
 * Log in a user and provide him a jwt access token
 */
Router.post('/logIn', (req,res) => {
    let signUpSchema = {
        email: Joi.string().email().required(),
        password : Joi.string().required()
    };
    Async.waterfall([
        (done) => {
            Joi.validate(req.body,signUpSchema,{},(err,result) => {
                done(err,result);
            });
        },
        (value,done) => {
            Debug("Payload from Joi validation",value);
            userController.logIn(value,done);
        }
    ],(err,result) => {
        Debug("Error and result",err,result);
        var reply;
        if(err){
            reply = Helpers.createError(err);
            return res.status(reply.statusCode).send(reply.response);
        }
        reply = Helpers.createSuccessResponse(result);
        return res.status(reply.statusCode).send(reply.response);
    });
});

/**
 * Get users in the system
 */
Router.get('/users', Middlewares.userAuth);
Router.get('/users', (req,res) => {
    Async.waterfall([
        (done) => {
            userController.getUsers({userId : req.cookies.user._id},done);
        }
    ],(err,result) => {
        Debug("Error and result",err,result);
        var reply;
        if(err){
            reply = Helpers.createError(err);
            return res.status(reply.statusCode).send(reply.response);
        }
        reply = Helpers.createSuccessResponse(result);
        return res.status(reply.statusCode).send(reply.response);
    });
});

/**
 * Subscribe to the fields of a user
 */
Router.post('/subscribe/:userId', Middlewares.userAuth);
Router.post('/subscribe/:userId', (req,res) => {
    let payload = Object.assign({},req.params,req.body);
    let subscribeSchema = {
        userId : Joi.string().hex().length(24),
        fields : Joi.array().items(Joi.string().valid(Constants.ALLOWED_FIELDS)).required()
    };
    Async.waterfall([
        (done) => {
            Joi.validate(payload,subscribeSchema,{},(err,result) => {
                done(err,result);
            });
        },
        (value,done) => {
            Debug("Payload from Joi validation",value);
            value.user = req.cookies.user;
            userController.subscribe(value,done);
        }
    ],(err,result) => {
        Debug("Error and result",err,result);
        var reply;
        if(err){
            reply = Helpers.createError(err);
            return res.status(reply.statusCode).send(reply.response);
        }
        reply = Helpers.createSuccessResponse(result);
        return res.status(reply.statusCode).send(reply.response);
    });
});


/**
 * Update my fields
 */
Router.put('/updateProfile', Middlewares.userAuth);
Router.put('/updateProfile', (req,res) => {
    let updateSchema = {
        'firstName' : Joi.string().trim(),
        'lastName' : Joi.string().trim(),
        'favColor' : Joi.string().trim(),
        'favPlace' : Joi.string().trim()
    };
    Async.waterfall([
        (done) => {
            Joi.validate(req.body,updateSchema,{},done);
        },
        (value,done) => {
            Debug("Payload from Joi validation",value);
            value.user = req.cookies.user;
            userController.updateProfile(value,done);
        }
    ],(err,result) => {
        Debug("Error and result",err,result);
        var reply;
        if(err){
            reply = Helpers.createError(err);
            return res.status(reply.statusCode).send(reply.response);
        }
        reply = Helpers.createSuccessResponse(result);
        return res.status(reply.statusCode).send(reply.response);
    });
});

/**
 * log out a user and disconnect his sockets
 */
Router.put('/logOut', Middlewares.userAuth);
Router.put('/logOut', (req,res) => {
    Async.waterfall([
        (done) => {
            userController.logOut({userId : req.cookies.user._id},done);
        }
    ],(err,result) => {
        Debug("Error and result",err,result);
        var reply;
        if(err){
            reply = Helpers.createError(err);
            return res.status(reply.statusCode).send(reply.response);
        }
        reply = Helpers.createSuccessResponse(result);
        return res.status(reply.statusCode).send(reply.response);
    });
});

module.exports = Router;