const express = require('express');
const controllers_depense = require("./depense_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");
const RoleUser = require("../../static/Role_user")
const check_role = require('./../../middleware/Role_middleware')


router.post('/add', [Authentification_token, check_role([RoleUser.Manager])], controllers_depense.AddDepense)
router.put('/update/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_depense.UpdateDepense)
router.delete('/remove/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_depense.DeleteDepense)
router.get('/', Authentification_token, controllers_depense.ListDepense)
router.get('/depense/:id', Authentification_token, controllers_depense.GetDepense)


module.exports = router;