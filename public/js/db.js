const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ksiegarnia', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('Błąd połączenia z bazą danych: ' + err);
    process.exit(1);
  }
};

// Funkcja wykonująca zapytanie do bazy danych
async function queryDatabase(model, query, params = {}) {
  try {
    const results = await model.find(query, params);
    return results;
  } catch (err) {
    throw new Error('Błąd zapytania: ' + err);
  }
}

module.exports = { connectDB, queryDatabase };