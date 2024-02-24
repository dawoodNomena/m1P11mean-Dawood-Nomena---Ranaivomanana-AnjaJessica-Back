const express = require('express');
const controllers_user = require("./user_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware")
const RoleUser = require("../../static/Role_user")

// Authentification
router.post('/signup', controllers_user.Sign_up)
router.post('/login', controllers_user.Login)
router.post('/logout',Authentification_token, controllers_user.Logout)

//Profil
router.get('/profil',Authentification_token, controllers_user.GetUser)
router.get('/employe/disponible', Authentification_token, controllers_user.List_employe_dispo)
router.get('/statistiques/temps_moyen_travail', Authentification_token,controllers_user.temps_moyen_travail)

//Employe
router.post('/employe/create',Authentification_token, controllers_user.AddUser)
router.post('/employe/update/:id',Authentification_token, controllers_user.UpdateUser)
router.post('/employe/delete/:id',Authentification_token, controllers_user.DeleteUser)

module.exports = router;