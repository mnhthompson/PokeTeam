import { allPokemon, filteredPokemon, getPokemonDetails, renderPage } from './team.js';

const searchInput = document.getElementById("pokemon-search-input");
const typeFilter = document.getElementById("type-filter");

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
initTypeFilter();

export async function renderFilteredList() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;

  filteredPokemon.length = 0; 

  for (const p of allPokemon) {
    const details = await getPokemonDetails(p);
    const name = details.name.toLowerCase();
    const types = details.types.map(t => t.type.name).join(', ').toLowerCase();

    if ((!search || name.includes(search)) && (!type || types.includes(type))) {
      filteredPokemon.push(details);
    }
  }

  renderPage(0, filteredPokemon);
}

searchInput?.addEventListener("input", renderFilteredList);
typeFilter?.addEventListener("change", renderFilteredList);
