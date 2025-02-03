require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const authRoutes = require("./server/routes/auth");
const inputValidators = require("./validators/inputValidators");
const router = require("./server/routes/main");
const orderRoutes = require("./server/routes/orderRoutes"); // Importuj trasę zamówień
const { connectDB, queryDatabase } = require('./public/js/db');
const Book = require('./models/Book');
const User = require('./models/User');
const app = express();
const PORT = 8000;


// Connect to MongoDB
connectDB();

// Ustawienie silnika szablonów na EJS
app.set("view engine", "ejs");

// Ścieżka do widoków
app.set("views", __dirname + "/views");

// Serwowanie plików statycznych
app.use(express.static(__dirname + "/public"));

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

<<<<<<< Updated upstream

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
=======
// Example route to get books based on a query or return all books
// Nowy endpoint wyszukiwania z Mongoose
app.get("/searchBooks", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.json({ books: [] });
  }
  try {
    // Szukamy książek, których tytuł lub autor zawiera zapytanie (case-insensitive)
    const books = await Book.find({
      $or: [
        { Title: { $regex: query, $options: 'i' } },
        { Author: { $regex: query, $options: 'i' } }
      ]
    });
    res.json({ books });
  } catch (err) {
    console.error("Błąd podczas wyszukiwania:", err);
    res.status(500).json({ error: "Błąd podczas wyszukiwania." });
  }
>>>>>>> Stashed changes
});


// Example route to get users based on a query or return all users
app.get("/users", async (req, res) => {
  try {
    const query = req.query || {};
    const users = await queryDatabase(User, query);
    res.json(users);
  } catch (err) {
    console.log("Błąd zapytania:", err.message);
    res.status(500).send("Błąd serwera");
  }
});

// Other routes and middleware
app.use("/auth", authRoutes);
app.use("/order", orderRoutes); // Zarejestruj trasę zamówień
app.use("/", router);

app.listen(PORT, (err) => {
  if (err) {
    console.log("err.message:", err.message);
    return;
  }
  console.log(`Server started on port ${PORT}`);
});
