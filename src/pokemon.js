const infoUrl = {
  limitOfPokemons: 20,
  offset: 0,
  urlInitial: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  urlActual: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  numberOfPageActual: 1,
};

async function getPokemons() {
  const response = await fetch(infoUrl.urlActual);
  const responseInJson = await response.json();
  return { pokemons: responseInJson.results };
}

async function getPokemonsQuantity() {
  const response = await fetch(infoUrl.urlActual);
  const responseInJson = await response.json();
  return responseInJson.count;
}

async function getInfoPokemon(urlOfPokemon) {
  const response = await fetch(urlOfPokemon);
  const infoPokemonJson = await response.json();
  return infoPokemonJson;
}

async function getHabitatPokemon(idPokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idPokemon}`);
  const responseJson = await response.json();
  if (responseJson.habitat) {
    return { habitat: responseJson.habitat.name };
  }
  return { habitat: 'no-habitat' };
}

function updateUrlActual(offset) {
  infoUrl.urlActual = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=20`;
}

async function getEggGroupsPokemon(idPokemon) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idPokemon}`);
  const responseJson = await response.json();
  const eggGroups = [];
  responseJson.egg_groups.forEach((eggGroup) => {
    eggGroups.push(eggGroup.name);
  });
  return { eggGroups };
}

export {
  getPokemons, getInfoPokemon, getHabitatPokemon, getEggGroupsPokemon, getPokemonsQuantity,
  updateUrlActual,
};
export { infoUrl };
