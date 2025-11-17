
const API_BASE = 'https://pokeapi.co/api/v2/';
const cache = new Map();

export async function fetchPokemonList(limit = 900, offset = 0) {
  const url = `${API_BASE}pokemon?limit=${limit}&offset=${offset}`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results; 
}

export async function fetchPokemonDetails(nameOrId) {
  if (cache.has(nameOrId)) return cache.get(nameOrId);

  const res = await fetch(`${API_BASE}pokemon/${nameOrId}`);
  const data = await res.json();
  cache.set(nameOrId, data);
  return data;
}

export async function fetchPokemonTypes() {
  const res = await fetch(`${API_BASE}type`);
  const data = await res.json();
  return data.results.map(t => t.name);
}
