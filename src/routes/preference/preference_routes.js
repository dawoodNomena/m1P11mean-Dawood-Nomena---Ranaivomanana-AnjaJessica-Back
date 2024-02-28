const express = require('express');
const controllers_preference = require("./preference_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");

// routes preference service
router.post('/service/add', Authentification_token, controllers_preference.AddPreferenceService)
router.get('/service', Authentification_token, controllers_preference.ListPreferenceServiceByClient)

//routes preference employe
router.post('/employe/add', Authentification_token, controllers_preference.AddPreferenceEmploye)
router.get('/employe', Authentification_token, controllers_preference.ListPreferenceEmployeByClient)

module.exports = router;