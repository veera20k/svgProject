#!/usr/bin/env node

/**
 * Module dependencies.
 */


 let configJSON = {};
 let envName = 'dev';
 process.argv.forEach(arg => {
   if (arg.startsWith('--env=')) {
     envName = arg.split('=')[1];
   }
 });
 
 configJSON = require(`./../config/${envName}.json`);
 
 Object.keys(configJSON).forEach(function (key) {
   process.env[key] = configJSON[key];
 });
 
 
 var app = require('../app');
 var debug = require('debug')('SvgMaster:server');
 var http = require('http');
 var https = require('https');
//  var MongoDB = require('./../routes/api/database');
 var fs = require('fs');
 
//  MongoDB.init().then(function () {
//    global.MongoDB = MongoDB;
//  }).catch(function (err) {
//    console.error(err);
//    process.exit(100);
//  });
 
 /**
  * Get port from environment and store in Express.
  */
 
 var port = normalizePort(process.env.PORT || '3000');
 app.set('port', port);
 
 /**
  * Create HTTP server.
  */
 var server = http.createServer(app);
 var httpsServer;
 
 if (process.env.secure === 'true' || process.env.secure === true) {
   const httpsPort = normalizePort(443);
   const privateKey = fs.readFileSync(process.env.privateKey, 'utf8');
   const certificate = fs.readFileSync(process.env.certificate, 'utf8');
   const ca = fs.readFileSync(process.env.ca, 'utf8');
   const credentials = {
     key: privateKey,
     cert: certificate,
     ca: ca
   };
 
   httpsServer = https.createServer(credentials, app);
   httpsServer.listen(httpsPort, () => {
     console.log('HTTPS Server running on port 443');
   });
   httpsServer.on('error', onHttpsError);
   httpsServer.on('listening', onHttpsListening);
 
   function onHttpsError(error) {
     if (error.syscall !== 'listen') {
       throw error;
     }
 
     var bind = typeof httpsPort === 'string' ? 'Pipe ' + httpsPort : 'Port ' + httpsPort;
 
     // handle specific listen errors with friendly messages
     switch (error.code) {
       case 'EACCES':
         console.error(bind + ' requires elevated privileges');
         process.exit(1);
         break;
       case 'EADDRINUSE':
         console.error(bind + ' is already in use');
         process.exit(1);
         break;
       default:
         throw error;
     }
   }
 
   function onHttpsListening() {
     var addr = httpsServer.address();
     var bind = typeof addr === 'string'
       ? 'pipe ' + addr
       : 'port ' + addr.port;
     debug('Listening on ' + bind);
   }
 
 }
 
 /**
  * Listen on provided port, on all network interfaces.
  */
 
 server.listen(port);
 server.on('error', onError);
 server.on('listening', onListening);
 
 /**
  * Normalize a port into a number, string, or false.
  */
 
 function normalizePort(val) {
   var port = parseInt(val, 10);
 
   if (isNaN(port)) {
     // named pipe
     return val;
   }
 
   if (port >= 0) {
     // port number
     return port;
   }
 
   return false;
 }
 
 /**
  * Event listener for HTTP server "error" event.
  */
 
 function onError(error) {
   if (error.syscall !== 'listen') {
     throw error;
   }
 
   var bind = typeof port === 'string'
     ? 'Pipe ' + port
     : 'Port ' + port;
 
   // handle specific listen errors with friendly messages
   switch (error.code) {
     case 'EACCES':
       console.error(bind + ' requires elevated privileges');
       process.exit(1);
       break;
     case 'EADDRINUSE':
       console.error(bind + ' is already in use');
       process.exit(1);
       break;
     default:
       throw error;
   }
 }
 
 /**
  * Event listener for HTTP server "listening" event.
  */
 
 function onListening() {
   var addr = server.address();
   var bind = typeof addr === 'string'
     ? 'pipe ' + addr
     : 'port ' + addr.port;
   debug('Listening on ' + bind);
 }
 
//  if (process.env.secure === 'true' || process.env.secure === true) {
//    let socketIO = require('socket.io')(httpsServer);
//    let whiteboard = require('./whiteboard');
//    whiteboard.init(socketIO);
//  }
//  else {
//    let socketIO = require('socket.io')(server);
//    let whiteboard = require('./whiteboard');
//    whiteboard.init(socketIO);
//  }
 