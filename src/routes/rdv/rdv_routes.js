const express = require('express');
const controllers_rdv = require("./rdv_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");

router.post('/add', Authentification_token, controllers_rdv.AddRdv)
router.post('/done/:id', Authentification_token, controllers_rdv.TerminerRdv)
router.get('/historique', Authentification_token, controllers_rdv.ListByClient)
router.get('/mes_rdv', Authentification_token, controllers_rdv.ListByEmploye)
router.get('/taches/suivi', Authentification_token,controllers_rdv.ListTaskByEmploye)
router.get('/statistiques/nombre_reservation', Authentification_token,controllers_rdv.Nombre_reservation)
router.get('/statistiques/chiffre_affaire', Authentification_token,controllers_rdv.Chiffre_affaire)
router.get('/statistiques/benefice', Authentification_token,controllers_rdv.Benefice_mensuel)

module.exports = router;