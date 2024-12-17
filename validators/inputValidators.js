const { body, validationResult } = require("express-validator");

// Walidacja rejestracji
const validateRegistration = [
  body("login")
    .isLength({ min: 3 })
    .withMessage("Login musi mieć co najmniej 3 znaki"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi mieć co najmniej 6 znaków"),
  body("email").isEmail().withMessage("Nieprawidłowy adres e-mail"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Walidacja logowania
const validateLogin = [
  body("login").notEmpty().withMessage("Login jest wymagany"),
  body("password").notEmpty().withMessage("Hasło jest wymagane"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    next();
  },
];

module.exports = { validateRegistration, validateLogin };
