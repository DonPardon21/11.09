const bcrypt = require("bcrypt");
const mysql = require("mysql");

// Konfiguracja połączenia z bazą danych
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ksiegarnia",
});

// Rejestracja użytkownika
async function registerUser(req, res) {
  const { login, password, email } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = "INSERT INTO users (Login, Password, Email) VALUES (?, ?, ?)";
    db.query(query, [login, hashedPassword, email], (err) => {
      if (err) {
        console.error("Błąd rejestracji:", err.message);
        return res.status(500).send("Wystąpił błąd");
      }
      res.status(201).send("Użytkownik zarejestrowany pomyślnie");
    });
  } catch (err) {
    console.error("Błąd rejestracji:", err);
    res.status(500).send("Wystąpił błąd");
  }
}

// Logowanie użytkownika
async function loginUser(req, res) {
  const { login, password } = req.body;  // login to może być login lub email

  try {
    // Sprawdzamy zarówno login, jak i email
    const query = "SELECT * FROM users WHERE Login = ? OR Email = ?";
    db.query(query, [login, login], async (err, results) => {  // Tu musimy oba parametry przekazać jako 'login'
      if (err) {
        console.error("Błąd logowania:", err.message);
        return res.status(500).send("Wystąpił błąd");
      }

      if (
        results.length === 0 ||
        !(await bcrypt.compare(password, results[0].Password))
      ) {
        return res.status(401).send("Nieprawidłowy login lub hasło");  // Ogólny komunikat
      }

      // Ustawienie sesji i ciasteczek
      req.session.user = {
        login: results[0].Login,
        email: results[0].Email,  // Dodanie emaila do sesji
        lastLogin: new Date(),
      };

      res.cookie("lastLogin", new Date().toISOString(), {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("message", "Zalogowano pomyślnie", {
        httpOnly: false,
        maxAge: 5000,
      });

      // Przekierowanie na stronę główną
      res.redirect("/main");
    });
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).send("Wystąpił błąd");
  }
}


module.exports = { registerUser, loginUser };
