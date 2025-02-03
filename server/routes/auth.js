const express = require("express");
const { registerUser, loginUser } = require("../../controllers/authController");
const {
  validateRegistration,
  validateLogin,
} = require("../../validators/inputValidators");
const { ensureAuthenticated } = require("../../middlewares/authMiddleware");
const Order = require("../../models/Order"); // Importuj model Order

const router = express.Router();

router.get("/account", ensureAuthenticated, async (req, res) => {
  const user = req.session.user;
  console.log("auth");

  console.log(user);

  try {
    // Pobierz zamówienia użytkownika
    const orders = await Order.find({ userId: user._id });
    res.render("layouts/account", { user, orders });
  } catch (err) {
    console.error("Błąd pobierania zamówień:", err);
    res.status(500).send("Wystąpił błąd podczas pobierania zamówień.");
  }
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