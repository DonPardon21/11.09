const express = require('express');
const { registerUser, loginUser } = require('../../controllers/authController');
const { validateRegistration, validateLogin } = require('../validators/inputValidators');

const router = express.Router();

// Rejestracja
router.post('/register', validateRegistration, registerUser);

// Logowanie
router.post('/login', validateLogin, loginUser);

module.exports = router;
