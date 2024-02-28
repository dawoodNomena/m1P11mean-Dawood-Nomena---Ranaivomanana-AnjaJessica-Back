const express = require('express');
const controllers_service = require("./service_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");
const RoleUser = require("../../static/Role_user")
const check_role = require('./../../middleware/Role_middleware')


router.post('/add', [Authentification_token, check_role([RoleUser.Manager])], controllers_service.CreateService)
router.post('/update/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_service.UpdateService)
router.post('/delete/:id', [Authentification_token, check_role([RoleUser.Manager])], controllers_service.DeleteService)

router.get('/service/:id', Authentification_token, controllers_service.GetService)
router.get('/', Authentification_token, controllers_service.ListServiceByCategorie)
router.get('/:categorie', Authentification_token, controllers_service.ListServiceByCategorie)

module.exports = router;