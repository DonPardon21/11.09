const bcrypt = require("bcrypt");
const { getDb } = require("../public/js/db");

// Rejestracja użytkownika
async function registerUser(req, res) {
  const { login, password, email } = req.body;

  try {
    const db = getDb();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = { login, password: hashedPassword, email };
    await db.collection("users").insertOne(user);

    res.status(201).send("Użytkownik zarejestrowany pomyślnie");
  } catch (err) {
    console.error("Błąd rejestracji:", err);
    res.status(500).send("Wystąpił błąd");
  }
}

// Logowanie użytkownika
async function loginUser(req, res) {
  const { login, password } = req.body;

  try {
    const db = getDb();
    const user = await db.collection("users").findOne({ login });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Nieprawidłowe dane logowania");
    }

    // Ustawienie ciasteczka i sesji
    req.session.user = { login: user.login, lastLogin: new Date() };
    res.cookie("lastLogin", new Date().toISOString(), { httpOnly: true });

    // Ustawienie ciasteczka z wiadomością o sukcesie
    res.cookie("message", "Zalogowano pomyślnie", { httpOnly: false, maxAge: 5000 });

    // Przekierowanie na stronę główną
    res.redirect("/mainpage");
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).send("Wystąpił błąd");
  }
}

module.exports = { registerUser, loginUser };
