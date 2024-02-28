const express = require('express');
const controllers_salaire = require("./salaire_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");
const RoleUser = require("../../static/Role_user")
const check_role = require('./../../middleware/Role_middleware')

router.post('/add', [Authentification_token, check_role([RoleUser.Manager])], controllers_salaire.AddSalaire)
router.put('/update/:id',[Authentification_token, check_role([RoleUser.Manager])], controllers_salaire.UpdateSalaire)
router.delete('/remove/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_salaire.DeleteSalaire)
router.get('/salaire/:id', Authentification_token, controllers_salaire.GetSalaire)
router.get('/', Authentification_token, controllers_salaire.ListSalaire)

module.exports = router;