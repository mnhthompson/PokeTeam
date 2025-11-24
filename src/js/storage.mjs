const STORAGE_KEY = 'savedTeams';

export function getSavedTeams() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveTeam(name, teamArray) {
  if (!name || !teamArray.length) throw new Error('Name and team are required');
  const savedTeams = getSavedTeams();
  const index = savedTeams.findIndex(t => t.name === name);

  const teamObject = { name, team: teamArray };
  if (index >= 0) {
    savedTeams[index] = teamObject;
  } else {
    savedTeams.push(teamObject);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTeams));
}

export function deleteTeam(name) {
  const savedTeams = getSavedTeams().filter(t => t.name !== name);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTeams));
}
