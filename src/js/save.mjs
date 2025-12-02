import { getSavedTeams, deleteTeam } from './storage.mjs';
import { loadHeaderFooter } from "./utils.mjs";

loadHeaderFooter();

const savedTeamsEl = document.getElementById('saved-teams-list');
const exportBtn = document.getElementById('export-json');

function renderSavedTeams() {
  savedTeamsEl.innerHTML = '';
  const savedTeams = getSavedTeams();

  if (!savedTeams.length) {
    savedTeamsEl.innerHTML = '<p>No saved teams yet.</p>';
    return;
  }

  savedTeams.forEach(t => {
    const card = document.createElement('div');
    card.className = 'saved-team-card';

    const title = document.createElement('h3');
    title.className = 'team-title';
    title.textContent = t.name || "Unnamed Team";
    card.appendChild(title);


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
    
      sessionStorage.setItem('currentTeam', JSON.stringify(t.team));
      window.location.href = '/team/index.html';
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteTeam(t.name);
      renderSavedTeams();
    });

    actions.appendChild(loadBtn);
    actions.appendChild(deleteBtn);

    card.appendChild(icons);
    card.appendChild(actions);
    savedTeamsEl.appendChild(card);
  });
}


renderSavedTeams();

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


