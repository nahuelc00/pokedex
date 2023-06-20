/* eslint-disable import/extensions */

import { Pokemon } from '../entities/pokemon.js';

function mapPokemon(dataApi) {
  const {
    name, types, sprites, height, weight, id, abilities, stats,
  } = dataApi;

  const pokemon = new Pokemon(name, types, sprites, height, weight, id, abilities, stats);
  return pokemon;
}

export { mapPokemon };
