const express = require('express');
const router = express.Router();
const controllers_paiement = require('./paiement_controllers')
const Authentification_token = require("./../../middleware/Auth_middleware");

router.post('/rdv/:id', Authentification_token, controllers_paiement.Payer)

module.exports = router