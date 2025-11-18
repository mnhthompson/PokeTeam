// pokedex.js
const searchInput = document.getElementById("pokemon-search-input");
const typeFilter = document.getElementById("type-filter");
const pokemonListEl = document.getElementById("pokemon-list");

// Wait until team.js has added cards
const observer = new MutationObserver(() => {
  if (pokemonListEl.children.length > 0) {
    observer.disconnect();
    initTypeFilter();
  }
});

observer.observe(pokemonListEl, { childList: true });

function initTypeFilter() {
  const types = new Set();

  // Scan all cards for types
  Array.from(pokemonListEl.children).forEach(card => {
    const typeText = card.children[2].textContent; // "fire, flying"
    typeText.split(", ").forEach(t => types.add(t));
  });

  // Populate dropdown
  [...types].sort().forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type[0].toUpperCase() + type.slice(1);
    typeFilter.appendChild(opt);
  });
}

function applyFilters() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;

  Array.from(pokemonListEl.children).forEach(card => {
    const name = card.children[1].textContent.toLowerCase();
    const types = card.children[2].textContent.toLowerCase(); // "fire, flying"

    let visible = true;

    if (search && !name.includes(search)) visible = false;
    if (type && !types.includes(type.toLowerCase())) visible = false;

    card.style.display = visible ? "block" : "none";
  });
}

searchInput?.addEventListener("input", applyFilters);
typeFilter?.addEventListener("change", applyFilters);
