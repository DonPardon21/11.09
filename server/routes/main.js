const express = require("express");
const router = express.Router();
const { queryDatabase } = require("../../public/js/db"); // Załóżmy, że plik z połączeniem z bazą to db.js
const { ensureAuthenticated } = require("../../middlewares/authMiddleware")
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
      return res
        .status(500)
        .json({ error: "Nie udało się usunąć produktu z koszyka." });
    }

    res.status(200).json({ ok: "Produkt został usunięty z koszyka." });
  });
});

router.get("/shipping", (req, res) => {
  res.render("layouts/shipping");
});

router.get("/contact", (req, res) => {
  res.render("layouts/contact");
});

router.get("/login", (req, res) => {
  res.render("layouts/login");
});

router.get("/zamow", ensureAuthenticated, (req, res) => {
  const cart = req.session.cart ? req.session.cart.cartProducts : [];
  const totalAmount = cart.reduce((sum, book) => {
    const price = book.Sale_price || book.Price;
    return sum + price * book.quantity;
  }, 0);

  // Czyszczenie koszyka po odwiedzeniu strony „Zamów”
  req.session.cart = null;

  res.render("layouts/zamow", { cart, totalAmount, user: req.session.user });
});





router.get("/outlet", async (req, res) => {
  const locals = {
    title: "Outlet",
    description: "Książki używane w super cenach!",
  };

  try {
    // Pobranie książek używanych (IsUsed = 1)
    const books = await queryDatabase("SELECT * FROM books WHERE IsUsed = 1");
    res.render("layouts/outlet", { locals, books });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania książek.");
  }
});

router.get("/about", (req, res) => {
  res.render("layouts/about");
});

router.get("/ksiazki", async (req, res) => {
  const locals = {
    title: "Książki",
    description: "Wszystkie dostępne książki.",
  };

  try {
    // Pobranie wszystkich podręczników (CategoryID = 1)
    const books = await queryDatabase(
      "SELECT * FROM books WHERE CategoryID = ?",
      [1] // CategoryID = 1 dla książek
    );
    res.render("layouts/podreczniki", { locals, books, category: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania podręczników.");
  }
});

router.get("/ksiazki/:category", async (req, res) => {
  const category = req.params.category;
  const locals = {
    title: `Książki - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: `Dostępne podręczniki z kategorii ${category}.`,
  };

  // Mapowanie kategorii na SubCategoryID
  const subCategoryMap = {
    fantastyka: 1,
    historia: 2,
    kryminal: 3,
    religia: 4,
  };

  const subCategoryID = subCategoryMap[category];

  if (!subCategoryID) {
    return res.status(404).send("Nie znaleziono kategorii.");
  }

  try {
    // Pobranie podręczników z określonej podkategorii
    const books = await queryDatabase(
      "SELECT * FROM books WHERE SubCategoryID = ?",
      [subCategoryID]
    );
    res.render("layouts/ksiazki", { locals, books, category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania książek.");
  }
});

router.get("/podreczniki", async (req, res) => {
  const locals = {
    title: "Podręczniki",
    description: "Wszystkie dostępne podręczniki.",
  };

  try {
    // Pobranie wszystkich podręczników (CategoryID = 2)
    const books = await queryDatabase(
      "SELECT * FROM books WHERE CategoryID = ?",
      [2] // CategoryID = 2 dla podręczników
    );
    res.render("layouts/podreczniki", { locals, books, category: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania podręczników.");
  }
});

router.get("/podreczniki/:category", async (req, res) => {
  const category = req.params.category;
  const locals = {
    title: `Podręczniki - ${
      category.charAt(0).toUpperCase() + category.slice(1)
    }`,
    description: `Dostępne podręczniki z kategorii ${category}.`,
  };

  // Mapowanie kategorii na SubCategoryID
  const subCategoryMap = {
    szkolaPodstawowa: 5,
    technikumLiceum: 6,
    matura: 7,
  };

  const subCategoryID = subCategoryMap[category];

  if (!subCategoryID) {
    return res.status(404).send("Nie znaleziono kategorii.");
  }

  try {
    // Pobranie podręczników z określonej podkategorii
    const books = await queryDatabase(
      "SELECT * FROM books WHERE SubCategoryID = ?",
      [subCategoryID]
    );
    res.render("layouts/podreczniki", { locals, books, category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania podręczników.");
  }
});

module.exports = router;
