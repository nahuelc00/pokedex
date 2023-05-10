const infoUrl = {
  urlInitial: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  url: 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20',
  page: '',
};

async function getPokemons() {
  const response = await fetch(infoUrl.url);
  const responseInJson = await response.json();
  const nextUrlPokemons = responseInJson.next;
  const previousUrlPokemons = responseInJson.previous;

  infoUrl.page === 'next' ? (infoUrl.url = nextUrlPokemons) : ''; // eslint-disable-line no-unused-expressions

  if (infoUrl.page === 'previous' && infoUrl.url === infoUrl.urlInitial) {
    infoUrl.url = infoUrl.urlInitial;
  } else if (infoUrl.page === 'previous') {
    infoUrl.url = previousUrlPokemons;
  }

  const responsePokemons = await fetch(infoUrl.url);
  const responsePokemonsInJson = await responsePokemons.json();
  return { pokemons: responsePokemonsInJson.results };
}

async function getInfoPokemon(urlOfPokemon) {
  const response = await fetch(urlOfPokemon);
  const infoPokemonJson = response.json();
  return infoPokemonJson;
}

async function getHabitatPokemon(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
  const responseJson = await response.json();
  const habitat = responseJson.habitat.name;
  return { habitat };
}

async function getEggGroupsPokemon(pokemonName) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`);
  const responseJson = await response.json();
  const eggGroups = [];
  responseJson.egg_groups.forEach((eggGroup) => {
    eggGroups.push(eggGroup.name);
  });
  return { eggGroups };
}

export {
  getPokemons, getInfoPokemon, getHabitatPokemon, getEggGroupsPokemon,
};
export { infoUrl };
