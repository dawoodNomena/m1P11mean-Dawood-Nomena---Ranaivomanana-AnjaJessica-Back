
var express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var http = require('http');
var debug = require('debug')('m1p11mean-Dawood-Nomena---Ranaivomanana-AnjaJessica-Back:server');

var users_routes = require('./src/routes/user/user_routes')
var services_routes = require('./src/routes/service/service_routes')
var permission_routes = require('./src/routes/permission/permission_routes')
var depense_routes = require('./src/routes/depense/depense_routes')
var offre_routes = require('./src/routes/offre/offre_routes')
var preference_routes = require('./src/routes/preference/preference_routes')
var salaire_routes = require('./src/routes/salaire/salaire_routes')

var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes 
app.use('/users', users_routes)
app.use('/services', services_routes)
app.use('/permission', permission_routes)
app.use('/depenses', depense_routes)
app.use('/offres', offre_routes)
app.use('/preferences', preference_routes)
app.use('/salaires', salaire_routes)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).json({
      message: "Route inexistant"
    })
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    res.status(err.status || 500).json({
      message: "Message d'erreur"
    })
  });


  // Server

  var port = normalizePort('3000' || '3002');
  app.set('port', port);
  
  /**
   * Create HTTP server.
   */
  
  var server = http.createServer(app);
  
  /**
   * Listen on provided port, on all network interfaces.
   */
  
  server.listen(port, '0.0.0.0');
  server.on('error', onError);
  server.on('listening', onListening);
  console.log("Attente des requêtes au port "+port);

  
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