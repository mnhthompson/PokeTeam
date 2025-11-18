import { fetchPokemonList, fetchPokemonDetails } from './pokemon.js';
import { addPokemonToTeam, removePokemonFromTeam, team, getTeamStats } from './teambuilder.js';

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

let currentPage = 0;
const pageSize = 6;
let currentPokemon = null;

let allPokemon = [];
let displayedPokemon = [];

async function init() {
  await fetchAndCachePokemon(900);
  displayedPokemon = [...allPokemon]; // show all initially
  renderPage(0);
}

async function fetchAndCachePokemon(limit = 900) {
  const stored = JSON.parse(localStorage.getItem('allPokemon') || '[]');
  if (stored.length >= limit) {
    allPokemon = stored;
    return allPokemon;
  }

  const list = await fetchPokemonList(limit);
  allPokemon = [];

  for (const p of list) {
    const details = await fetchPokemonDetails(p.name);
    allPokemon.push({
      name: details.name,
      types: details.types,
      sprites: details.sprites,
      abilities: details.abilities,
      stats: details.stats
    });
  }

  localStorage.setItem('allPokemon', JSON.stringify(allPokemon));
  return allPokemon;
}

function renderPage(page) {
  currentPage = page;
  pokemonListEl.innerHTML = '';

  const start = page * pageSize;
  const end = start + pageSize;
  const slice = displayedPokemon.slice(start, end);

  slice.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.sprites.front_default}" alt="${p.name}">
      <p>${p.name}</p>
      <p>${p.types.map(t => t.type.name).join(', ')}</p>`;
    card.addEventListener('click', () => openModal(p));
    pokemonListEl.appendChild(card);
  });
}


function openModal(pokemon) {
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

addToTeamBtn?.addEventListener('click', () => {
  if (currentPokemon && addPokemonToTeam(currentPokemon)) {
    renderTeam();
    modal.style.display = 'none';
  } else {
    alert('Team is full!');
  }
});

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
    document.getElementById('avg-hp').textContent = stats.hp;
    document.getElementById('avg-attack').textContent = stats.attack;
    document.getElementById('avg-defense').textContent = stats.defense;
    document.getElementById('avg-speed').textContent = stats.speed;
    document.getElementById('avg-specialattack').textContent = stats.specialattack;
    document.getElementById('avg-specialdefence').textContent = stats.specialdefense;
  }
}

document.getElementById('next-page')?.addEventListener('click', () => {
  const maxPage = Math.floor(displayedPokemon.length / pageSize);
  if (currentPage < maxPage) renderPage(currentPage + 1);
});

document.getElementById('prev-page')?.addEventListener('click', () => {
  if (currentPage > 0) renderPage(currentPage - 1);
});


document.addEventListener("filterChanged", e => {
  displayedPokemon = e.detail;
  renderPage(0);
});

init();
