/**
 * Module dependencies.
 */
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
const DotEnv = require('dotenv');
DotEnv.load({ path: 'config.env' });
const Express = require('express');
const Compression = require('compression');
const bodyParser = require('body-parser');
const Chalk = require('chalk');
const errorHandler = require('errorhandler');
const path = require('path');
const Mongoose = require('mongoose');
const expressValidator = require('express-validator');
const ExpressStatusMonitor = require('express-status-monitor');
const Boom = require('express-boom');

const Socket = require('./lib/socket');
const userRouter = require('./routes/userRoutes');
const Notifier = require('./lib/notifier');

/**
 * Create Express server.
 */
const app = Express();

/**
 * Connect to MongoDB.
 */
Mongoose.Promise = global.Promise;
Mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
Mongoose.connection.on('connected', () => {
  console.log('%s MongoDB connection established!', Chalk.green('✓'));
});
Mongoose.connection.on('error', () => {
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', Chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.use(ExpressStatusMonitor());
app.use(Compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(Boom());
app.use(Express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
//Socket.bootStrapSocket(app);
app.use(userRouter);


/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(app.get('port'), () => {
  console.log('%s Express server listening on port %d in %s mode.', Chalk.green('✓'), app.get('port'), app.get('env'));
});

Socket.bootStrapSocket(server);

module.exports = app;
