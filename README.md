MongoDB Notifier
================

This project is designed to provide real time updated to the users about other users who are making changes to their profiles.

Deployment Steps
-----------------

It assumes you have mongoDB, node.js and redis installed on your server.

0. Create a config file in your root directory named `config.env` and it should contain following values for essential app configuration.

    `MONGODB_URI=localhost:27017/test`
    `REDIS_STORE=redis://localhost:6379`
    `REDIS_PUB_SUB=redis://localhost:6379`

0. Install node modules by running `npm install`
0. Start mongoDB in replication mode as --  `mongod --dbpath ~/Downloads --replSet sample`
0. Start the redis server
0. Run main file as `node app.js`

