/**
 * Created by vik on 28/10/16.
 */
const Log = require('../models').Log;
const cursor = Log.find({op  : 'u',ns : 'test.users',fromMigrate : {$exists : false}},{},
        { awaitData : true, tailable : true}).cursor();

module.exports = cursor;