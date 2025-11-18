import { openModal } from './team.js'; // reuse modal

const searchInput = document.getElementById("pokemon-search-input");
const typeFilter = document.getElementById("type-filter");
const pokemonListEl = document.getElementById("pokemon-list");

let allPokemon = [];

const allTypes = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic",
  "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

function initTypeFilter() {
  typeFilter.innerHTML = '';
  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = "All Types";
  typeFilter.appendChild(allOpt);

  allTypes.forEach(type => {
    const opt = document.createElement("option");
    opt.value = type;
    opt.textContent = type[0].toUpperCase() + type.slice(1);
    typeFilter.appendChild(opt);
  });
}

export function setAllPokemon(pokemonArray) {
  allPokemon = pokemonArray;
  renderFilteredList();
  initTypeFilter();
}

function renderFilteredList() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;

  pokemonListEl.innerHTML = '';

  allPokemon.forEach(p => {
    const name = p.name.toLowerCase();
    const types = p.types.map(t => t.type.name).join(', ').toLowerCase();

    if ((search && !name.includes(search)) || (type && !types.includes(type.toLowerCase()))) return;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.sprites.front_default}" alt="${p.name}">
      <p>${p.name}</p>
      <p>${p.types.map(t => t.type.name).join(', ')}</p>
    `;
    card.addEventListener('click', () => openModal(p));
    pokemonListEl.appendChild(card);
  });
}

searchInput?.addEventListener("input", renderFilteredList);
typeFilter?.addEventListener("change", renderFilteredList);
