const express = require('express');
const controllers_user = require("./user_controllers");
const router = express.Router();
const RoleUser = require("../../static/Role_user")

router.post('/signup', controllers_user.Sign_up)
router.post('/login', controllers_user.Login)

module.exports = router;