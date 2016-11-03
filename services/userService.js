/**
 * Created by vik on 01/11/16.
 */

'use strict';

var Models = require('../models');

//Get Users from DB
const getUser = function (criteria, projection, options, callback) {
    options.lean = true;
    Models.User.find(criteria, projection, options, callback);
};

//Insert User in DB
const createUser = function (objToSave, callback) {
    new Models.User(objToSave).save(callback);
};

//Update User in DB
const updateUser = function (criteria, dataToSet, options, callback) {
    options.lean = true;
    options.new = true;
    Models.User.findOneAndUpdate(criteria, dataToSet, options, callback);
};

//Delete User in DB
var deleteUser = function (criteria, callback) {
    Models.User.findOneAndRemove(criteria, callback);
};

module.exports = {
    getUser : getUser,
    createUser : createUser,
    updateUser : updateUser,
    deleteUser : deleteUser
};


