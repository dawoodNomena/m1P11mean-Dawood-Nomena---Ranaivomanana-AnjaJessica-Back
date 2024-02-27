
require('dotenv').config();


var express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
var logger = require('morgan');


var users_routes = require('./src/routes/user/user_routes')
var services_routes = require('./src/routes/service/service_routes')
var permission_routes = require('./src/routes/permission/permission_routes')
var depense_routes = require('./src/routes/depense/depense_routes')
var offre_routes = require('./src/routes/offre/offre_routes')
var preference_routes = require('./src/routes/preference/preference_routes')
var salaire_routes = require('./src/routes/salaire/salaire_routes')
var rdv_routes = require('./src/routes/rdv/rdv_routes')
var paiement_routes = require('./src/routes/paiement/paiement_routes')

var app = express();

app.use(logger('main'));
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
app.use('/rdv', rdv_routes)
app.use('/paiement', paiement_routes)

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

module.exports = app;
  