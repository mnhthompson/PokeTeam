import { fetchPokemonList, fetchPokemonDetails } from './pokemon.js';
import { addPokemonToTeam, removePokemonFromTeam, team, getTeamStats } from './teambuilder.js';
import { setAllPokemon } from './pokedex.js';

const pokemonListEl = document.getElementById('pokemon-list');
const teamSlotsEl = document.getElementById('team-slots');
const modal = document.getElementById('pokemon-modal');
const modalClose = document.getElementById('modal-close');
const modalName = document.getElementById('modal-name');
const modalSprite = document.getElementById('modal-sprite');
const modalType = document.getElementById('modal-type');
const modalAbilities = document.getElementById('modal-abilities');
const modalStats = document.getElementById('modal-stats');
const addToTeamBtn = document.getElementById('add-to-team');

let allPokemon = [];
let currentPokemon = null;

// Load Pokémon list (basic info)
async function loadAllPokemon() {
  const list = await fetchPokemonList(900);
  allPokemon = list; // basic info
  setAllPokemon(allPokemon); // share with Pokédex
  await renderPage(0);
}

loadAllPokemon();

// Render a card with full details
async function createPokemonCard(pokemon) {
  const details = pokemon.stats ? pokemon : await fetchPokemonDetails(pokemon.name);

  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${details.sprites.front_default}" alt="${details.name}">
    <p>${details.name}</p>
    <p>${details.types.map(t => t.type.name).join(', ')}</p>
  `;

  card.addEventListener('click', () => openModal(details));
  return card;
}

// Pagination
let currentPage = 0;
const pageSize = 6;

async function renderPage(page, list = allPokemon) {
  currentPage = page;
  pokemonListEl.innerHTML = '';
  const start = page * pageSize;
  const end = start + pageSize;
  const slice = list.slice(start, end);

  for (const p of slice) {
    const card = await createPokemonCard(p);
    pokemonListEl.appendChild(card);
  }
}

document.getElementById('next-page')?.addEventListener('click', () => {
  const maxPage = Math.floor(allPokemon.length / pageSize);
  if (currentPage < maxPage) renderPage(currentPage + 1);
});
document.getElementById('prev-page')?.addEventListener('click', () => {
  if (currentPage > 0) renderPage(currentPage - 1);
});

// Modal
export function openModal(pokemon) {
  currentPokemon = pokemon;
  modalName.textContent = pokemon.name;
  modalSprite.src = pokemon.sprites.front_default;
  modalType.textContent = pokemon.types.map(t => t.type.name).join(', ');
  modalAbilities.textContent = pokemon.abilities.map(a => a.ability.name).join(', ');
  modalStats.innerHTML = '';
  pokemon.stats.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.stat.name}: ${s.base_stat}`;
    modalStats.appendChild(li);
  });
  modal.style.display = 'flex';
}
modalClose?.addEventListener('click', () => (modal.style.display = 'none'));

addToTeamBtn?.addEventListener('click', async () => {
  if (!currentPokemon) return;
  let fullDetails = currentPokemon.stats ? currentPokemon : await fetchPokemonDetails(currentPokemon.name);
  if (addPokemonToTeam(fullDetails)) renderTeam();
  else alert('Team is full!');
  modal.style.display = 'none';
});

// Team rendering
function renderTeam() {
  teamSlotsEl.innerHTML = '';
  for (let i = 0; i < 6; i++) {
    const slot = document.createElement('div');
    slot.className = 'slot';
    if (team[i]) {
      slot.classList.add('filled');
      slot.innerHTML = `
        <img src="${team[i].sprites.front_default}" alt="${team[i].name}" title="Click to remove">
        <p>${team[i].name}</p>
      `;
      slot.addEventListener('click', () => {
        removePokemonFromTeam(team[i].name);
        renderTeam();
      });
    }
    teamSlotsEl.appendChild(slot);
  }

  const stats = getTeamStats();
  if (stats) {
    document.getElementById('avg-hp').textContent = stats.hp ?? 0;
    document.getElementById('avg-attack').textContent = stats.attack ?? 0;
    document.getElementById('avg-defense').textContent = stats.defense ?? 0;
    document.getElementById('avg-speed').textContent = stats.speed ?? 0;
    document.getElementById('avg-specialattack').textContent = stats.specialattack ?? 0;
    document.getElementById('avg-specialdefence').textContent = stats.specialdefense ?? 0;
  }
}

export { allPokemon, renderPage };
