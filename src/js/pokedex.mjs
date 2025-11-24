import { allPokemon, renderPage, openModal } from './team.mjs';

const searchInput = document.getElementById("pokemon-search-input");
const typeFilter = document.getElementById("type-filter");
const pokemonListEl = document.getElementById("pokemon-list");

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

async function renderFilteredList() {
  const search = searchInput.value.toLowerCase();
  const type = typeFilter.value;

  const filtered = allPokemon.filter(p => {
    const name = p.name.toLowerCase();
    const types = (p.types || []).map(t => t.type.name.toLowerCase());

   
    return (!search || name.includes(search)) && (!type || types.includes(type.toLowerCase()));
  });

  await renderPage(0, filtered);
}

searchInput?.addEventListener("input", renderFilteredList);
typeFilter?.addEventListener("change", renderFilteredList);

export function setAllPokemon(pokemonArray) {

}
