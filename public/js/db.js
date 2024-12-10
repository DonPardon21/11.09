const mysql = require("mysql");

// Funkcja tworząca połączenie z bazą danych
function createDbConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ksiegarnia",
  });
}

// Funkcja wykonująca zapytanie do bazy danych
function queryDatabase(sql, params = []) {
  const con = createDbConnection();

  return new Promise((resolve, reject) => {
    con.connect((err) => {
      if (err) {
        reject("Błąd połączenia z bazą danych: " + err);
        return;
      }

      con.query(sql, params, (err, results) => {
        if (err) {
          reject("Błąd zapytania: " + err);
          return;
        }

        resolve(results);
        con.end();
      });
    });
  });
}

module.exports = { queryDatabase };
