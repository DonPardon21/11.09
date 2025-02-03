document.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".searchBtn button");
  const searchBar = document.querySelector(".search-bar");

  searchButton.addEventListener("click", () => {
    const isExpanded = searchButton.getAttribute("aria-expanded") === "true";
    searchButton.setAttribute("aria-expanded", !isExpanded);

    if (!isExpanded) {
      searchBar.style.top = `${
        searchButton.getBoundingClientRect().bottom + window.scrollY
      }px`;
      searchBar.style.right = `${
        document.body.clientWidth - searchButton.getBoundingClientRect().right
      }px`;
      searchBar.classList.add("search-bar-active");
    } else {
      searchBar.classList.remove("search-bar-active");
    }
  });
});

function showModalMessage(message, isError = false) {
  const modal = document.getElementById("add-to-cart-modal");
  const modalMessage = document.getElementById("modal-message");

  modalMessage.textContent = message;

  if (isError) {
    modal.classList.add("error");
  } else {
    modal.classList.remove("error");
  }

  modal.style.display = "block";

  setTimeout(() => {
    modal.style.display = "none";
  }, 5000);
}

async function addProduct(object) {
  console.log(object);

  try {
    const response = await fetch("http://localhost:8000/cart", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(JSON.parse(object)),
    });

    if (response.ok) {
      const product = JSON.parse(object);
      const quantityElement = document.getElementById(
        `quantity-${product._id}`
      );
      if (quantityElement) {
        quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
      }
      showModalMessage("Produkt został dodany do koszyka!");
    } else {
      const error = await response.json();
      showModalMessage("Błąd: " + error.error, true);
    }
  } catch (err) {
    console.error("Błąd żądania dodania produktu:", err);
    showModalMessage("Wystąpił błąd podczas dodawania produktu.", true);
  }
}

async function removeProduct(object) {
  try {
    const response = await fetch("http://localhost:8000/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.parse(object)),
    });

    if (response.ok) {
      const product = JSON.parse(object);
      const productElement = document.getElementById(`book-${product._id}`);
      if (productElement) {
        productElement.remove();
      }
      showModalMessage("Produkt został usunięty z koszyka!");
    } else {
      const error = await response.json();
      showModalMessage("Błąd: " + error.error, true);
    }
  } catch (err) {
    console.error("Błąd żądania usunięcia produktu:", err);
    showModalMessage("Wystąpił błąd podczas usuwania produktu.", true);
  }
}

async function decreaseProduct(object) {
  try {
    const response = await fetch("http://localhost:8000/cart", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(JSON.parse(object)),
    });

    if (response.ok) {
      const product = JSON.parse(object);
      const quantityElement = document.getElementById(
        `quantity-${product._id}`
      );
      if (quantityElement) {
        const newQuantity = parseInt(quantityElement.textContent) - 1;
        if (newQuantity > 0) {
          quantityElement.textContent = newQuantity;
        } else {
          const productElement = document.getElementById(`book-${product._id}`);
          if (productElement) {
            productElement.remove();
          }
        }
      }
      showModalMessage("Ilość produktu została zmniejszona!");
    } else {
      const error = await response.json();
      showModalMessage("Błąd: " + error.error, true);
    }
  } catch (err) {
    console.error("Błąd żądania zmniejszenia ilości produktu:", err);
    showModalMessage(
      "Wystąpił błąd podczas zmniejszania ilości produktu.",
      true
    );
  }
}
