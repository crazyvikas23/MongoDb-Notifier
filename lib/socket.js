/**
 * Created by vik on 28/10/16.
 */

"use strict";

const SocketIO = require('socket.io');
const Debug = require('debug')('SOCKET_MODULE');
const Redis = require('redis').createClient;
const Adapter = require('socket.io-redis');
const Async = require('async');

const RedisStore = Redis(process.env.REDIS_STORE);
const Middlewares = require('../middlewares');
const EVENT_TYPES = require('../utils').Constants.EVENT_TYPES;

function bootStrapSocket(app){
    Debug('test');
    const io = SocketIO(app);
    io.use(Middlewares.userSocketAuth);
    io.adapter(Adapter({
        pubClient: Redis(process.env.REDIS_PUB_SUB,{return_buffers: true}),
        subClient: Redis(process.env.REDIS_PUB_SUB,{return_buffers: true})
    }));
    io.on(EVENT_TYPES.SOCKET_CONNECTED,(socket) => {
        Debug('Socket connected with Id %s',socket.id);
        addSocketId(socket.id,socket.user._id.toString());
        socket.on(EVENT_TYPES.PING,(socket) => {
            Debug('Ping received from socket with Id %s',socket.id);
            socket.emit('pong');
        });
        // Handle more socket events from user
    });
    io.on('error',(err) => {
        DEBUG(Chalk.red(err));
    });

    /**
     * Emit a event to the connected socket
     * @param userId
     * @param event
     * @param data
     * @param callback
     */
    function emitEventToSocket(userId,event,data,callback){
        if(typeof callback === 'undefined'){
            callback = noop;
        }
        Async.waterfall([
            (cb) => {
                getSocketId(userId,cb);
            },
            (socketId,cb) => {
                Debug('Socket id of the user',socketId);
                io.to(socketId).emit(event,data);
                cb();
            }
        ],(err,results) => {
            Debug('error and results',err,results);
            callback(err);
        })
    }
    exports.emitEventToSocket = emitEventToSocket;
}

/**
 * Update socket id of the user
 * @param socketId
 * @param userId
 * @param callback
 */
function addSocketId(socketId,userId,callback){
    if(typeof callback === 'undefined'){
        callback = noop;
    }
    RedisStore.set('user:socket:'+userId,socketId,  (err,result) => {
        Debug('sdads',err,result);
        callback(err,result);
    });
}

/**
 * Get socket id of the user
 * @param userId
 * @param callback
 */
function getSocketId(userId,callback){
    if(typeof callback === 'undefined'){
        callback = noop;
    }
    RedisStore.get('user:socket:'+userId, (err,result) => {
        Debug('sdaasdsadasdasdsads',err,result);
        callback(err,result);
    });
}

/**
 * Delete socket id of the user
 * @param userId
 * @param callback
 */
function delSocketId(userId,callback){
    if(typeof callback === 'undefined'){
        callback = noop;
    }
    RedisStore.del('user:socket:'+userId,  (err,result) => {
        callback(err,result);
    });
}


function noop(){
    //noop
}

exports.bootStrapSocket = bootStrapSocket;
exports.delSocketId = delSocketId;