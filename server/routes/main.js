const express = require("express");
const router = express.Router();
<<<<<<< Updated upstream
const { queryDatabase } = require("../../public/js/db"); // Załóżmy, że plik z połączeniem z bazą to db.js
const { ensureAuthenticated } = require("../../middlewares/authMiddleware")
// Routes
=======
const { queryDatabase } = require("../../public/js/db");
const { ensureAuthenticated } = require("../../middlewares/authMiddleware");
const Book = require("../../models/Book"); // Importowanie modelu Book

// Trasy
>>>>>>> Stashed changes

router.get("/", async (req, res) => {
  try {
    const books = await queryDatabase(Book, {});
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
    const books = await queryDatabase(Book, {});
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

  try {
    const books = await queryDatabase(Book, {
      $or: [
        { Title: { $regex: query, $options: "i" } },
        { Author: { $regex: query, $options: "i" } },
      ],
    });
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
  res.render("layouts/cart", { cart, user: req.session.user });
});

router.post("/cart", (req, res) => {
  const product = req.body; // Otrzymany produkt
  const productBookID = product._id; // Pobranie właściwego identyfikatora

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
      if (cartItem._id === productBookID) {
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

router.put("/cart", (req, res) => {
  const productId = req.body._id; // Identyfikator produktu do zmniejszenia ilości

  if (!req.session.cart || !req.session.cart.cartProducts) {
    return res.status(404).json({ error: "Koszyk jest pusty." });
  }

  // Zmniejsz ilość produktu w koszyku
  req.session.cart.cartProducts = req.session.cart.cartProducts.map(
    (cartItem) => {
      if (cartItem._id === productId) {
        cartItem.quantity -= 1; // Zmniejszenie ilości
        if (cartItem.quantity <= 0) {
          return null; // Usuń produkt, jeśli ilość jest mniejsza lub równa 0
        }
      }
      return cartItem;
    }
  ).filter(Boolean); // Filtruj null wartości

  req.session.save((err) => {
    if (err) {
      console.error("Błąd zapisywania sesji:", err);
      return res.status(500).json({ error: "Błąd zmniejszania ilości w koszyku" });
    }

    res.status(200).json({ ok: "Ilość produktu zmniejszona" });
  });
});

router.delete("/cart", (req, res) => {
  const productId = req.body._id; // Identyfikator produktu do usunięcia

  if (!req.session.cart || !req.session.cart.cartProducts) {
    return res.status(404).json({ error: "Koszyk jest pusty." });
  }

  // Filtruj koszyk, aby usunąć produkt o podanym _id
  req.session.cart.cartProducts = req.session.cart.cartProducts.filter(
    (cartItem) => cartItem._id !== productId
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

<<<<<<< Updated upstream




=======
>>>>>>> Stashed changes
router.get("/outlet", async (req, res) => {
  const locals = {
    title: "Outlet",
    description: "Książki używane w super cenach!",
  };

  try {
    // Pobranie książek używanych (IsUsed = true)
    const books = await queryDatabase(Book, { IsUsed: true });
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
    // Pobranie wszystkich książek
    const books = await queryDatabase(Book, {});
    res.render("layouts/ksiazki", { locals, books, category: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania książek.");
  }
});

router.get("/ksiazki/:category", async (req, res) => {
  const category = req.params.category;
  const locals = {
    title: `Książki - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
    description: `Dostępne książki z kategorii ${category}.`,
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
    // Pobranie książek z określonej podkategorii
    const books = await queryDatabase(Book, { SubCategoryID: subCategoryID });
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
    const books = await queryDatabase(Book, { CategoryID: 2 });
    res.render("layouts/podreczniki", { locals, books, category: null });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania podręczników.");
  }
});

router.get("/podreczniki/:category", async (req, res) => {
  const category = req.params.category;
  const locals = {
    title: `Podręczniki - ${category.charAt(0).toUpperCase() + category.slice(1)}`,
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
    const books = await queryDatabase(Book, { SubCategoryID: subCategoryID });
    res.render("layouts/podreczniki", { locals, books, category });
  } catch (err) {
    console.error(err);
    res.status(500).send("Błąd podczas pobierania podręczników.");
  }
});

module.exports = router;