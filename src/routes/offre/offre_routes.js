const express = require('express');
const controllers_offre = require("./offre_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");
const RoleUser = require("../../static/Role_user")
const check_role = require('./../../middleware/Role_middleware')


router.post('/add', [Authentification_token, check_role([RoleUser.Manager])], controllers_offre.AddOffre)
router.put('/update/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_offre.UpdateOffre)
router.delete('/remove/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_offre.DeleteOffre)
router.get('/', Authentification_token, controllers_offre.ListOffre)
router.get('/offre/:id', Authentification_token, controllers_offre.GetOffre)

module.exports = router;