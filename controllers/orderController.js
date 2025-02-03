const Order = require('../models/Order');

async function createOrder(req, res) {
  const { userId, amount, status } = req.body;

  console.log("Dane zamówienia:", { userId, amount, status });

  try {
    const newOrder = new Order({
      userId,
      amount,
      status,
    });

    await newOrder.save();
    console.log("Zamówienie utworzone:", newOrder);
    res.redirect('/auth/account'); // Przekierowanie do strony profilu
  } catch (err) {
    console.error("Błąd tworzenia zamówienia:", err.message);
    res.status(500).send("Wystąpił błąd podczas tworzenia zamówienia");
  }
}

module.exports = { createOrder };