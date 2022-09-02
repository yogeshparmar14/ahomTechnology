const express = require('express');
const { registration,login } = require('../modules/authentication/authController.js');
 
const router = express.Router();
//Public routes
router.post('/register',registration);
router.post('/login',login)
 
module.exports = router;