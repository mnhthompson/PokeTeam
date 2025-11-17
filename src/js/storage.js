

const STORAGE_KEY = 'savedTeams';

export function saveTeam(name, team) {
  const savedTeams = getSavedTeams();
  savedTeams.push({ name, team });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTeams));
}

export function getSavedTeams() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function deleteTeam(name) {
  const savedTeams = getSavedTeams().filter(t => t.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTeams));
}
