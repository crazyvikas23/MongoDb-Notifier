"use strict";
/**
 * Created by vik on 01/11/16.
 */
const Mongoose = require('mongoose');
const Chalk = require('chalk');

let uri = (process.env.MONGODB_URI || process.env.MONGOLAB_URI);
if(!uri){
    console.log(Chalk.red('✗'),"Failed connecting to local database for oplog. Please enable replication");
    process.exit(1);
}
console.log(uri);
uri = uri.slice(0,uri.lastIndexOf('/')) + '/local';
console.log(uri);

const newConn = Mongoose.createConnection(uri);

newConn.on('error',(err) => {
    console.log(Chalk.red('✗'),"Failed connecting to local database for oplog. Please enable replication",err);
});

const Log = newConn.model('Log',{},'oplog.rs');
module.exports = Log;