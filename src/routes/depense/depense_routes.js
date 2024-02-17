const express = require('express');
const controllers_depense = require("./depense_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");


router.post('/add', Authentification_token, controllers_depense.AddDepense)
router.put('/update/:id', Authentification_token, controllers_depense.UpdateDepense)
router.delete('/remove/:id', Authentification_token, controllers_depense.DeleteDepense)
router.get('/', Authentification_token, controllers_depense.ListDepense)
router.get('/depense/:id', Authentification_token, controllers_depense.GetDepense)


module.exports = router;