require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoutes = require("./server/routes/auth");
const inputValidators = require("./validators/inputValidators");
const router = require("./server/routes/main");
const mysql = require("mysql");
const app = express();
const PORT = 8000;

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false }
  })
);


app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

app.use("/auth", authRoutes);

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "ksiegarnia",
});

app.use(express.static("public"));

app.set("views", __dirname + "/views");

app.set("view engine", "ejs");

app.use("", router);

// Trasa do wyszukiwania książek
app.get("/search", (req, res) => {
  const searchQuery = req.query.query;

  if (searchQuery) {
    const query = `
      SELECT * FROM books 
      WHERE Title LIKE ? OR Author LIKE ?
    `;
    con.query(
      query,
      [`%${searchQuery}%`, `%${searchQuery}%`],
      (err, results) => {
        if (err) {
          console.log("Błąd zapytania:", err.message);
          return res.status(500).send("Błąd serwera");
        }
        // Zwróć wyniki w formacie JSON
        res.json(results);
      }
    );
  } else {
    // Jeśli nie ma zapytania, zwróć wszystkie książki
    con.query("SELECT * FROM books", (err, results) => {
      if (err) {
        console.log("Błąd zapytania:", err.message);
        return res.status(500).send("Błąd serwera");
      }
      res.json(results); // Zwróć wszystkie książki
    });
  } 
});

app.listen(PORT, (err) => {
  if (err) {
    console.log("err.message:", err.message);
    return;
  }

  console.log(`Serwer nasłuchuje na porcie ${PORT}`);
});
