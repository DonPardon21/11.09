const express = require("express");
const { registerUser, loginUser } = require("../../controllers/authController");
const {
  validateRegistration,
  validateLogin,
} = require("../../validators/inputValidators");
const { ensureAuthenticated } = require("../../middlewares/authMiddleware");

const router = express.Router();

router.get("/account", ensureAuthenticated, (req, res) => {
  const user = req.session.user;
  console.log("auth");

  console.log(user);
  // Możesz dodać zapytanie do bazy danych, aby pobrać zamówienia
  const orders = []; // Przykładowa pusta lista zamówień
  res.render("layouts/account", { user, orders });
});

router.get("/logout", (req, res) => {
  req.session.user = null;
  res.redirect("/login");
});

// Rejestracja
router.post("/register", validateRegistration, registerUser);

// Logowanie
router.post("/login", validateLogin, loginUser);

module.exports = router;
