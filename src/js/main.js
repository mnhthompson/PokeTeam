import { fetchPokemonDetails } from './pokemon.js';
import { saveTeam } from './storage.js';

const TEAM_SIZE = 6; 

async function generateDailyTeam() {
  const container = document.getElementById("daily-team");
  container.innerHTML = ""; 

  const promises = [];
  for (let i = 0; i < TEAM_SIZE; i++) {
    const randId = Math.floor(Math.random() * 898) + 1;
    promises.push(fetchPokemonDetails(randId));
  }

  const team = await Promise.all(promises);


  team.forEach(pokemon => {
    const slot = document.createElement("div");
    slot.className = "slot";
    slot.classList.add('filled');
    slot.innerHTML = `
      <img src="${pokemon.sprites.front_default}" 
           alt="${pokemon.name}" />
      <h3>${pokemon.name}</h3>
    `;

    container.appendChild(slot);
  });
}
document.addEventListener("DOMContentLoaded", generateDailyTeam);


let currentDailyTeam = [];  
const saveDailyTeamBtn = document.getElementById('save-daily-team');
if (saveDailyTeamBtn) {
  saveDailyTeamBtn.addEventListener('click', () => {
    if (!currentDailyTeam || currentDailyTeam.length === 0) {
      alert("No team to save!");
      return;
    }
    const name = prompt("Enter a name for this team:");
    if (!name) {
      alert("Team not saved — name is required.");
      return;
    }
    try {
      saveTeam(name, currentDailyTeam);
      alert(`Team "${name}" saved successfully!`);
    } catch (err) {
      alert("Error saving team: " + err.message);
    }
  });
}




// Navigation Buttons
const startBtn = document.getElementById('start-building');
if (startBtn) {
  startBtn.addEventListener('click', () => {
    window.location.href = './team/index.html';
  });
}

const saveBtn = document.getElementById('load-saved-team');
if (saveBtn) {
  saveBtn.addEventListener('click', () => {
    window.location.href = './save/index.html';
  });
}
