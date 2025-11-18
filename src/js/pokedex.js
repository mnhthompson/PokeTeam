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

async function renderFilteredList() {
  pokemonListEl.innerHTML = '';

  for (const p of allPokemon) {
    const name = p.name.toLowerCase();
    const types = p.types?.map(t => t.type.name).join(', ').toLowerCase() || '';
    if ((search && !name.includes(search)) || (type && !types.includes(type.toLowerCase()))) continue;

    const details = await fetchPokemonDetails(p.name);

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${details.sprites.front_default}" alt="${details.name}">
      <p>${details.name}</p>
      <p>${details.types.map(t => t.type.name).join(', ')}</p>
    `;
    card.addEventListener('click', () => openModal(details));
    pokemonListEl.appendChild(card);
  }
}


searchInput?.addEventListener("input", renderFilteredList);
typeFilter?.addEventListener("change", renderFilteredList);
