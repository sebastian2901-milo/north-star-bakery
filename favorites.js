"use strict";

const catalog = { breads: "Breads", pastries: "Pastries", cakes: "Cakes" };
const favoriteKey = "north-star-bakery-favorites";
const favoritePanel = document.querySelector("#favorites");
const favoriteButtons = document.querySelectorAll("[data-favorite]");

function readFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(favoriteKey));
    return Array.isArray(saved)
      ? [...new Set(saved.filter((id) => Object.hasOwn(catalog, id)))]
      : [];
  } catch {
    return [];
  }
}

function showFavorites(favorites, message) {
  const items = favorites.map((id) => {
    const item = document.createElement("li");
    item.textContent = catalog[id];
    return item;
  });
  document.querySelector("#favorite-list").replaceChildren(...items);
  document.querySelector("#favorite-request").hidden = favorites.length === 0;
  document.querySelector("#favorite-status").textContent = message ||
    (favorites.length ? "Favorites saved on this browser." : "Save a category to plan your next preorder.");
  favoriteButtons.forEach((button) => {
    const id = button.dataset.favorite;
    const saved = favorites.includes(id);
    button.textContent = `${saved ? "Remove" : "Save"} ${catalog[id].toLowerCase()}`;
    button.setAttribute("aria-pressed", String(saved));
  });
}

if (favoritePanel) {
  let favorites = readFavorites();
  favoritePanel.hidden = false;
  showFavorites(favorites);
  favoriteButtons.forEach((button) => {
    button.hidden = false;
    button.addEventListener("click", () => {
      const id = button.dataset.favorite;
      const wasSaved = favorites.includes(id);
      const updated = wasSaved ? favorites.filter((item) => item !== id) : [...favorites, id];
      try {
        localStorage.setItem(favoriteKey, JSON.stringify(updated));
      } catch {
        showFavorites(favorites, "Browser storage is unavailable. You can still use the preorder form.");
        return;
      }
      favorites = updated;
      showFavorites(favorites, `${catalog[id]} ${wasSaved ? "removed from" : "added to"} your favorites.`);
    });
  });
}
