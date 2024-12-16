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
  let cart = [];

  if (req.session && req.session.cart) {
    cart = req.session.cart.cartProducts;
    console.log(cart);
  }
  res.render("layouts/cart", { cart });
});

router.post("/cart", (req, res) => {
  const product = req.body; // Otrzymany produkt
  const productBookID = product.BookID; // Pobranie właściwego identyfikatora

  console.log("Dodawany produkt:", product);

  // Inicjalizacja koszyka, jeśli nie istnieje
  if (!req.session.cart) {
    req.session.cart = { cartProducts: [] };
  }

  console.log("Koszyk przed dodaniem:", req.session.cart.cartProducts);

  // Sprawdzenie, czy produkt już istnieje w koszyku
  let productExists = false;
  req.session.cart.cartProducts = req.session.cart.cartProducts.map(
    (cartItem) => {
      if (cartItem.BookID === productBookID) {
        cartItem.quantity += 1; // Zwiększenie ilości
        productExists = true;
      }
      return cartItem;
    }
  );

  // Jeśli produkt nie istnieje, dodaj go do koszyka
  if (!productExists) {
    product.quantity = 1; // Inicjalizacja ilości
    req.session.cart.cartProducts.push(product);
    console.log("Dodano nowy produkt do koszyka:", product);
  }

  console.log("Koszyk po dodaniu:", req.session.cart.cartProducts);

  // Zapis sesji
  req.session.save((err) => {
    if (err) {
      console.error("Błąd zapisywania sesji:", err);
      return res.status(500).json({ error: "Błąd dodawania do koszyka" });
    }
    res.status(200).json({ ok: "Produkt dodany do koszyka" });
  });
});

router.delete("/cart", (req, res) => {
  const productId = req.body.BookID; // Identyfikator produktu do usunięcia

  if (!req.session.cart || !req.session.cart.cartProducts) {
    return res.status(404).json({ error: "Koszyk jest pusty." });
  }

  // Filtruj koszyk, aby usunąć produkt o podanym BookID
  req.session.cart.cartProducts = req.session.cart.cartProducts.filter(
    (cartItem) => cartItem.BookID !== productId
  );

  req.session.save((err) => {
    if (err) {
      console.error("Błąd zapisywania sesji:", err);
      return res.status(500).json({ error: "Nie udało się usunąć produktu z koszyka." });
    }

    res.status(200).json({ ok: "Produkt został usunięty z koszyka." });
  });
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
