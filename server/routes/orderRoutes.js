const express = require('express');
const { createOrder } = require('../../controllers/orderController');
const { ensureAuthenticated } = require('../../middlewares/authMiddleware');

const router = express.Router();

// Trasa do tworzenia zamówienia
router.post('/create', ensureAuthenticated, createOrder);

module.exports = router;