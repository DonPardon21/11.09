const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  Title: String,
  Author: String,
  Price: Number,
  Sale_price: Number,
  Stock: Number,
  IsUsed: Boolean,
  Image: String,
  CategoryID: Number,
  SubCategoryID: Number,
  _id: { type: String, unique: true }, // Unikalny identyfikator książki
});

module.exports = mongoose.model('Book', BookSchema);