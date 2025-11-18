// pokedex.js
const searchInput = document.getElementById("pokemon-search-input");
const typeFilter = document.getElementById("type-filter");
const pokemonListEl = document.getElementById("pokemon-list");

let allPokemon = JSON.parse(localStorage.getItem("allPokemon") || "[]");
let filteredPokemon = [...allPokemon]; 



function initTypeFilter() {
  const types = new Set();

  // Scan all cards for types
  allPokemon.forEach(p => {
    p.types.forEach(t => types.add(t.type.name));
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
  const type = typeFilter.value.toLowerCase();

  filteredPokemon = allPokemon.filter(p => {
    const nameMatch = p.name.toLowerCase().includes(search);
    const typeMatch = type ? p.types.some(t => t.type.name.toLowerCase() === type) : true;
    return nameMatch && typeMatch;
  });

  document.dispatchEvent(new CustomEvent("filterChanged", { detail: filteredPokemon }));
}

searchInput?.addEventListener("input", applyFilters);
typeFilter?.addEventListener("change", applyFilters);

initTypeFilter();