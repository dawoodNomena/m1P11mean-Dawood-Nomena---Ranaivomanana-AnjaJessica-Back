
var express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

var users_routes = require('./src/routes/user/user_routes')

var app = express();

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes 
app.use('/users', users_routes)

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
