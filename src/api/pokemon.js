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

async function getInfoOfSpecieFromApi(pokemonId) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
  const infoOfSpecie = await response.json();
  return infoOfSpecie;
}

async function getInfoPokemonFromApi(urlOfPokemon) {
  const response = await fetch(urlOfPokemon);
  const infoPokemonJson = await response.json();
  return infoPokemonJson;
}

function updateUrlActual(offset) {
  infoUrl.urlActual = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
}

export {
  getPokemonsFromApi, getInfoPokemonFromApi,
  getPokemonsQuantityFromApi, updateUrlActual, getInfoOfSpecieFromApi,
};
export { infoUrl };
