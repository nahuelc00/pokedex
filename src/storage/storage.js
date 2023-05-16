function setPokemonInStorage(pokemonName, pokemonData) {
  localStorage.setItem(`pokemon_${pokemonName}`, JSON.stringify(pokemonData));
}

function getPokemonFromStorage(pokemonName) {
  const pokemon = JSON.parse(localStorage.getItem(`pokemon_${pokemonName}`));
  return pokemon;
}

export { setPokemonInStorage, getPokemonFromStorage };
