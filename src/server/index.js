//Include api modules.
const http = require('http');
const express = require('express');
const config = require('config');
const bodyParser = require('body-parser');

//Define routes and events
const routes = require('./routes');
const events = require('./events.js');

const { port } = config.get('server');

//Start Express-js.
const app = express();
const server = http.createServer(app);

//Load middlewares.
const { errorHandler } = require('./middleware.js');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Bind the api routes.
app.use('/health', routes.health);
app.use('/auth', routes.auth);

//Bind error handler middleware.
app.use(errorHandler);

//Start listen mode.
app.listen(port, () => events.onListen(port));

//Define server "special" event to handle situations.
server.on('error', events.onServerError);
process.on('SIGINT', () => events.onProcessKill(server));
process.on('SIGTERM', () => events.onProcessKill(server));
process.on('unhandledRejection', events.onException);
process.on('uncaughtException', (err) => events.onException(err));
