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
  }, 3500);
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
      showModalMessage("Produkt został dodany do koszyka!");
     setTimeout(() => location.reload(), 1000);
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
      showModalMessage("Produkt został usunięty z koszyka!");
      setTimeout(() => location.reload(), 1000);
    } else {
      const error = await response.json();
      showModalMessage("Błąd: " + error.error, true);
    }
  } catch (err) {
    console.error("Błąd żądania usunięcia produktu:", err);
    showModalMessage("Wystąpił błąd podczas usuwania produktu.", true);
  }
}
