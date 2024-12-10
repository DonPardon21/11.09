const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../public/js/db"); // Załóżmy, że plik z połączeniem z bazą to db.js

// Routes

router.get("/", async (req, res) => {
  try {
    const books = await queryDatabase("SELECT * FROM books");
    const locals = {
      title: "Księgarnia Libran",
      description: "Księgarnia On-line na każdą kieszeń",
    };
    res.render("layouts/index", { locals, books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera.");
  }
});

router.get("/main", async (req, res) => {
  try {
    const books = await queryDatabase("SELECT * FROM books");
    res.render("layouts/main", { books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd serwera.");
  }
});

router.get("/searchBooks", async (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.json({ books: [] });
  }

  const sql = `
    SELECT * FROM books
    WHERE Title LIKE ? OR Author LIKE ?
  `;

  try {
    const books = await queryDatabase(sql, [`%${query}%`, `%${query}%`]);
    res.json({ books });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Błąd podczas wyszukiwania." });
  }
});

router.get("/cart", (req, res) => {
  res.render("layouts/cart");
});

router.get("/login", (req, res) => {
  res.render("layouts/login");
});

router.get("/outlet", (req, res) => {
  res.render("layouts/outlet");
});

router.get("/about", (req, res) => {
  res.render("layouts/about");
});

router.get("/ksiazki", (req, res) => {
  res.render("layouts/ksiazki", { category: null });
});

router.get("/ksiazki/:category", async (req, res) => {
  const category = req.params.category;
  const locals = {
    title: `Książki - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: `Dostępne książki z kategorii ${category}.`,
  };

  try {
    const books = await queryDatabase(
      "SELECT * FROM books WHERE Category = ?",
      [category]
    );
    res.render("layouts/ksiazki", { locals, books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania książek.");
  }
});

router.get("/podreczniki", (req, res) => {
  res.render("layouts/podreczniki", { category: null });
});

router.get("/podreczniki/:category", async (req, res) => {
  const category = req.params.category;
  const locals = {
    title: `Podręczniki - ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`,
    description: `Dostępne podręczniki z kategorii ${category}.`,
  };

  try {
    const books = await queryDatabase(
      "SELECT * FROM books WHERE Category = ?",
      [category]
    );
    res.render("layouts/podreczniki", { locals, books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania podręczników.");
  }
});

module.exports = router;
