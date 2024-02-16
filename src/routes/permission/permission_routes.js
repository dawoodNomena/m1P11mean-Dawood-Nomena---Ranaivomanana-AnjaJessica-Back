const express = require('express');
const controllers_premission = require("./permission_controllers");
const router = express.Router();
const Authentification_token = require("./../../middleware/Auth_middleware");

router.post('/add',Authentification_token, controllers_premission.AddPermission)

module.exports = router;