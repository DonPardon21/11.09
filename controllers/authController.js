const bcrypt = require("bcrypt");
const User = require("../models/User"); // Importowanie modelu User

// Rejestracja użytkownika
async function registerUser(req, res) {
  const { login, password, email } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      login,
      password: hashedPassword,
      email,
    });

    await newUser.save();
    res.status(201).send("Użytkownik zarejestrowany pomyślnie");
  } catch (err) {
    console.error("Błąd rejestracji:", err.message);
    res.status(500).send("Wystąpił błąd podczas rejestracji");
  }
}

// Logowanie użytkownika
async function loginUser(req, res) {
  const { login, password } = req.body;

  try {
    const user = await User.findOne({ login });
    if (!user) {
      return res.status(400).send("Nieprawidłowy login lub hasło.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Nieprawidłowy login lub hasło.");
    }

    // Zapisz datę ostatniego logowania
    user.lastLogin = new Date();
    await user.save();

    req.session.user = user;
    res.redirect("/main");
  } catch (err) {
    console.error("Błąd logowania:", err.message);
    res.status(500).send("Wystąpił błąd podczas logowania");
  }
}

module.exports = { registerUser, loginUser };