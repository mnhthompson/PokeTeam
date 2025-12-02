import { fetchPokemonList, fetchPokemonDetails } from './pokemon.mjs';
import { addPokemonToTeam, removePokemonFromTeam, team, getTeamStats, clearTeam, getTeamTypes } from './teambuilder.mjs';
import { setAllPokemon } from './pokedex.mjs';
import { saveTeam } from './storage.mjs';
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

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
const saveBtn = document.getElementById('save-team');
const teamNameInput = document.getElementById('team-name');


let allPokemon = [];
let currentPokemon = null;


async function loadAllPokemon() {
  const list = await fetchPokemonList(900);
  allPokemon = list; 
  setAllPokemon(allPokemon); 
  await renderPage(0);
}

loadAllPokemon();




async function createPokemonCard(pokemon) {
  const details = pokemon.stats ? pokemon : await fetchPokemonDetails(pokemon.name);

  const card = document.createElement('div');
  card.className = 'card';
  card.setAttribute('tabindex', '0');                   
  card.setAttribute('role', 'button');                  
  card.setAttribute('aria-label', `View details for ${details.name}`);

  card.innerHTML = `
    <img src="${details.sprites.front_default}" alt="${details.name}">
    <p>${details.name}</p>
    <p>${details.types.map(t => t.type.name).join(', ')}</p>
  `;

  card.addEventListener('click', () => openModal(details));
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();  
      openModal(details);
    }
  });

  return card;
}


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

export function openModal(pokemon) {
  currentPokemon = pokemon;
  modalName.textContent = pokemon.name;
  modalSprite.src = pokemon.sprites.front_default;


  modalType.innerHTML = pokemon.types
  .map(t => {
    const type = t.type.name.toLowerCase();
    const icon = typeIcons[type];
    return `<img src="${icon}" alt="${type}" class="type-icon-modal">`;
  })
  .join(' ');


  modalAbilities.textContent = pokemon.abilities.map(a => a.ability.name).join(', ');
  modalStats.innerHTML = '';
  pokemon.stats.forEach(s => {
    const li = document.createElement('li');
    li.textContent = `${s.stat.name}: ${s.base_stat}`;
    modalStats.appendChild(li);
  });
  modal.style.display = 'flex';
    addToTeamBtn.focus();
}
modalClose?.addEventListener('click', () => (modal.style.display = 'none'));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    modal.style.display = 'none';
  }
});

addToTeamBtn?.addEventListener('click', async () => {
  if (!currentPokemon) return;
  let fullDetails = currentPokemon.stats ? currentPokemon : await fetchPokemonDetails(currentPokemon.name);
  if (addPokemonToTeam(fullDetails)) renderTeam();
  else alert('Team is full!');
  modal.style.display = 'none';
});

modal.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

const typeIcons = {
  normal: '/images/NormalIC_LA.png',
  fire: '/images/FireIC_LA.png',
  water: '/images/WaterIC_LA.png',
  grass: '/images/GrassIC_LA.png',
  electric: '/images/ElectricIC_LA.png',
  ice: '/images/IceIC_LA.png',
  fighting: '/images/FightingIC_LA.png',
  poison: '/images/PoisonIC_LA.png',
  ground: '/images/GroundIC_LA.png',
  flying: '/images/FlyingIC_LA.png',
  psychic: '/images/PsychicIC_LA.png',
  bug: '/images/BugIC_LA.png',
  rock: '/images/RockIC_LA.png',
  ghost: '/images/GhostIC_LA.png',
  dark: '/images/DarkIC_LA.png',
  dragon: '/images/DragonIC_LA.png',
  steel: '/images/SteelIC_LA.png',
  fairy: '/images/FairyIC_LA.png'
};

function renderTypeCoverage() {
  const typeCoverageEl = document.getElementById('type-coverage');
  if (!typeCoverageEl) return;

  const types = getTeamTypes();
  typeCoverageEl.innerHTML = '';

  if (types.length === 0) {
    typeCoverageEl.innerHTML = '<li>No types yet</li>';
    return;
  }

  types.forEach(type => {
    const li = document.createElement('li');
    const img = document.createElement('img');
    img.src = typeIcons[type.toLowerCase()] || '//images/DefaultIC_LA.png';
    img.alt = type;
    img.title = type;
    img.className = 'type-icon'; // add a class for sizing in CSS
    li.appendChild(img);
    typeCoverageEl.appendChild(li);
  });
}

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

       slot.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      removePokemonFromTeam(team[i].name);
      renderTeam();
       }
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
   document.getElementById('avg-specialdefense').textContent = stats.specialdefense ?? 0;

  }
  
  renderTypeCoverage();
}


const savedTeam = JSON.parse(sessionStorage.getItem('currentTeam') || '[]');
if (savedTeam.length) {
  clearTeam();
  savedTeam.forEach(p => addPokemonToTeam(p));
  sessionStorage.removeItem('currentTeam');
  renderTeam(); 
}



saveBtn.addEventListener('click', () => {
  const name = teamNameInput.value.trim();
  if (!name) return alert('Please enter a team name!');
  if (!team.length) return alert('Cannot save an empty team!');
  
  try {
    saveTeam(name, team);
    alert(`Team "${name}" saved!`);
    teamNameInput.value = ''; // clear input
  } catch (err) {
    alert(err.message);
  }
});

  export { allPokemon, renderPage };
