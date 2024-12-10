

document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.querySelector(".searchBtn button");
    const searchBar = document.querySelector(".search-bar");
  
    searchButton.addEventListener("click", () => {
      const isExpanded = searchButton.getAttribute("aria-expanded") === "true";
      searchButton.setAttribute("aria-expanded", !isExpanded);
  
      if (!isExpanded) {
        searchBar.style.top = `${searchButton.getBoundingClientRect().bottom + window.scrollY}px`; // Umieszczamy pasek pod przyciskiem
        searchBar.style.right = `${document.body.clientWidth - searchButton.getBoundingClientRect().right}px`; // Dopasowanie do prawej krawędzi
        searchBar.classList.add("search-bar-active");
      } else {
        searchBar.classList.remove("search-bar-active");
      }
    });
  });
  