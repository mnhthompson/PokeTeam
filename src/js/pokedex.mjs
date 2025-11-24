import { allPokemon as globalPokemon, renderPage, openModal } from './team.mjs';

const searchInput = document.getElementById("pokemon-search-input");
const typeFilter = document.getElementById("type-filter");

const allTypes = [
  "normal", "fire", "water", "grass", "electric", "ice",
  "fighting", "poison", "ground", "flying", "psychic",
  "bug", "rock", "ghost", "dark", "dragon", "steel", "fairy"
];

let filteredPokemon = [];
let currentPage = 0;
const pageSize = 6;

export function setAllPokemon(pokemonArray) {
  filteredPokemon = pokemonArray;
  renderFilteredList();
  initTypeFilter();
}

function initTypeFilter() {
  if (!typeFilter) return;
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


async function renderFilteredList() {
  const search = searchInput?.value.toLowerCase() || '';
  const type = typeFilter?.value.toLowerCase() || '';

  filteredPokemon = globalPokemon.filter(p => {
    const name = p.name.toLowerCase();
    const types = p.types?.map(t => t.type.name.toLowerCase()) || [];

    const nameMatch = !search || name.includes(search);
    const typeMatch = !type || types.includes(type);

    return nameMatch && typeMatch;
  });

  currentPage = 0;
  await renderPage(currentPage, filteredPokemon);
}


document.getElementById('next-page')?.addEventListener('click', () => {
  const maxPage = Math.floor(filteredPokemon.length / pageSize);
  if (currentPage < maxPage) currentPage++, renderPage(currentPage, filteredPokemon);
});

document.getElementById('prev-page')?.addEventListener('click', () => {
  if (currentPage > 0) currentPage--, renderPage(currentPage, filteredPokemon);
});


searchInput?.addEventListener("input", renderFilteredList);
typeFilter?.addEventListener("change", renderFilteredList);
