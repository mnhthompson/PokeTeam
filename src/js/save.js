
import { addPokemonToTeam, team} from './teambuilder.js';
import { getSavedTeams, deleteTeam } from './storage.js';




const savedTeamsEl = document.getElementById('saved-teams-list');
const exportBtn = document.getElementById('export-json');

if (savedTeamsEl) {
  const savedTeams = getSavedTeams();
  savedTeams.forEach(t => renderSavedTeam(t));
}

function renderSavedTeam(t) {
  const card = document.createElement('div');
  card.className = 'saved-team-card';
  const icons = document.createElement('div');
  icons.className = 'team-icons';
  t.team.forEach(p => {
    const img = document.createElement('img');
    img.src = p.sprites.front_default;
    img.alt = p.name;
    icons.appendChild(img);
  });
  const actions = document.createElement('div');
  actions.className = 'team-actions';
  const loadBtn = document.createElement('button');
  loadBtn.textContent = 'Load';
  loadBtn.addEventListener('click', () => {
    team.length = 0;
    t.team.forEach(p => addPokemonToTeam(p));
    window.location.href = './team-builder.html';
  });
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener('click', () => {
    deleteTeam(t.name);
    card.remove();
  });
  actions.appendChild(loadBtn);
  actions.appendChild(deleteBtn);
  card.appendChild(icons);
  card.appendChild(actions);
  savedTeamsEl.appendChild(card);
}

exportBtn?.addEventListener('click', () => {
  const data = JSON.stringify(getSavedTeams(), null, 2);
  const blob = new Blob([data], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved-teams.json';
  a.click();
  URL.revokeObjectURL(url);
});