const express = require('express');
const controllers_rdv = require("./rdv_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");

router.post('/add', Authentification_token, controllers_rdv.AddRdv)
router.post('/done/:id', Authentification_token, controllers_rdv.TerminerRdv)
router.get('/historique', Authentification_token, controllers_rdv.ListByClient)
router.get('/mes_rdv', Authentification_token, controllers_rdv.ListByEmploye)

module.exports = router;