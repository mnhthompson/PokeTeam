
export const MAX_TEAM_SIZE = 6;
export let team = [];

export function addPokemonToTeam(pokemon) {
  if (team.length >= MAX_TEAM_SIZE) return false;
  team.push(pokemon);
  return true;
}

export function removePokemonFromTeam(name) {
  team = team.filter(p => p.name !== name);
}

export function clearTeam() {
  team = [];
}

export function getTeamStats() {
  if (!team.length) return null;
  const stats = { hp: 0, attack: 0, defense: 0, speed: 0 };
  team.forEach(p => {
    stats.hp += p.stats.find(s => s.stat.name === 'hp').base_stat;
    stats.attack += p.stats.find(s => s.stat.name === 'attack').base_stat;
    stats.defense += p.stats.find(s => s.stat.name === 'defense').base_stat;
    stats.speed += p.stats.find(s => s.stat.name === 'speed').base_stat;
    stats.specialattack += p.stats.find(s => s.stat.name === 'specialattack').base_stat;
    stats.specialdefense += p.stats.find(s => s.stat.name === 'specialdefense').base_stat;
  });
  return {
    hp: Math.round(stats.hp / team.length),
    attack: Math.round(stats.attack / team.length),
    defense: Math.round(stats.defense / team.length),
    speed: Math.round(stats.speed / team.length),
    specialattack: Math.round(stats.specialattack / team.length),
    specialdefense: Math.round(stats.specialdefense / team.length)
  };
}

export function getTeamTypes() {
  const types = new Set();
  team.forEach(p => p.types.forEach(t => types.add(t.type.name)));
  return Array.from(types);
}