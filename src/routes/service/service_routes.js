const express = require('express');
const controllers_service = require("./service_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");


router.post('/add', Authentification_token, controllers_service.CreateService)
router.post('/update/:id', Authentification_token, controllers_service.UpdateService)
router.post('/delete/:id', Authentification_token, controllers_service.DeleteService)

router.get('/service/:id', Authentification_token, controllers_service.GetService)
router.get('/', Authentification_token, controllers_service.ListServiceByCategorie)
router.get('/:categorie', Authentification_token, controllers_service.ListServiceByCategorie)

module.exports = router;