/* eslint-disable import/extensions */

import { Pokemons } from '../entities/pokemons.js';

function mapPokemons(dataApi) {
  const { pokemons } = dataApi;

  const pokemonsList = new Pokemons(pokemons);
  return pokemonsList.pokemons;
}

export { mapPokemons };
