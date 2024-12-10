function searchBooks() {
    const searchQuery = document.getElementById('searchInput').value;
  
    if (searchQuery.length > 0) {
      fetch(`/search?query=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          const bookListContainer = document.querySelector('.book-list');
          bookListContainer.innerHTML = ''; // Wyczyść poprzednie wyniki
  
          if (data.length === 0) {
            bookListContainer.innerHTML = '<p>Brak wyników.</p>';
          } else {
            data.forEach(book => {
              bookListContainer.innerHTML += `
                <div class="book-item">
                  <img
                    src="images/bookImages/${book.Image}.png"
                    alt="${book.Title}"
                    class="book-cover"
                  />
                  <h2>${book.Title}</h2>
                  <p>Autor: ${book.Author}</p>
                  ${book.Sale_price ? `
                    <p>
                      Przed przeceną:
                      <strong style="text-decoration: line-through">${book.Price.toFixed(2)}</strong> PLN
                    </p>
                    <p>
                      Cena: <strong class="red">${book.Sale_price.toFixed(2)}</strong> PLN
                    </p>
                  ` : `<p>Cena: ${book.Price.toFixed(2)} PLN</p>`}
                  <button class="add-to-cart">Dodaj do koszyka</button>
                </div>
              `;
            });
          }
        })
        .catch(error => console.error('Błąd:', error));
    } else {
      document.querySelector('.book-list').innerHTML = ''; // Wyczyść wyniki, jeśli nie ma tekstu
      // Opcjonalnie: Wyświetl wszystkie książki, gdy pole wyszukiwania jest puste
      fetch(`/books`)
        .then(response => response.json())
        .then(data => {
          displayBooks(data); // Funkcja do wyświetlania wszystkich książek (jeśli pole jest puste)
        })
        .catch(error => console.error('Błąd:', error));
    }
  }
  
  // Funkcja do wyświetlania wszystkich książek w przypadku, gdy pole wyszukiwania jest puste
  function displayBooks(books) {
    const bookListContainer = document.querySelector('.book-list');
    bookListContainer.innerHTML = '';
    books.forEach(book => {
      bookListContainer.innerHTML += `
        <div class="book-item">
          <img
            src="images/bookImages/${book.Image}.png"
            alt="${book.Title}"
            class="book-cover"
          />
          <h2>${book.Title}</h2>
          <p>Autor: ${book.Author}</p>
          ${book.Sale_price ? `
            <p>
              Przed przeceną:
              <strong style="text-decoration: line-through">${book.Price.toFixed(2)}</strong> PLN
            </p>
            <p>
              Cena: <strong class="red">${book.Sale_price.toFixed(2)}</strong> PLN
            </p>
          ` : `<p>Cena: ${book.Price.toFixed(2)} PLN</p>`}
          <button class="add-to-cart">Dodaj do koszyka</button>
        </div>
      `;
    });
  }
  