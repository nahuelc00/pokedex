const infoUrl = {
  limitOfPokemons: 20,
  offset: 0,
  urlInitial: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  urlActual: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  numberOfPageActual: 1,
};

async function getPokemonsFromApi() {
  const response = await fetch(infoUrl.urlActual);
  const responseInJson = await response.json();
  return responseInJson.results;
}

async function getPokemonsQuantityFromApi() {
  const response = await fetch(infoUrl.urlActual);
  const responseInJson = await response.json();
  return responseInJson.count;
}

async function getInfoPokemonFromApi(urlOfPokemon) {
  const response = await fetch(urlOfPokemon);
  const infoPokemonJson = await response.json();
  return infoPokemonJson;
}

async function getHabitatPokemonFromApi(idPokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idPokemon}`);
  const responseJson = await response.json();
  return responseJson.habitat;
}

function updateUrlActual(offset) {
  infoUrl.urlActual = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
}

async function getEggGroupsPokemonFromApi(idPokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idPokemon}`);
  const responseJson = await response.json();
  return responseJson.egg_groups;
}

export {
  getPokemonsFromApi, getInfoPokemonFromApi, getHabitatPokemonFromApi, getEggGroupsPokemonFromApi,
  getPokemonsQuantityFromApi, updateUrlActual,
};
export { infoUrl };
