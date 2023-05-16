/* eslint-disable import/extensions */
import * as api from '../api/pokemon.js';

async function getPokemons() {
  const pokemons = await api.getPokemonsFromApi();
  return { pokemons };
}

async function getPokemonsQuantity() {
  const quantity = await api.getPokemonsQuantityFromApi();
  return quantity;
}

async function getInfoPokemon(urlPokemon) {
  const infoPokemonJson = await api.getInfoPokemonFromApi(urlPokemon);
  return infoPokemonJson;
}

async function getHabitatPokemon(idPokemon) {
  const response = await api.getHabitatPokemonFromApi(idPokemon);
  if (response) {
    return { habitat: response.name };
  }
  return { habitat: 'no-habitat' };
}

async function getEggGroupsPokemon(idPokemon) {
  const eggGroupsApi = await api.getEggGroupsPokemonFromApi(idPokemon);
  const eggGroups = [];

  eggGroupsApi.forEach((eggGroup) => {
    eggGroups.push(eggGroup.name);
  });
  return { eggGroups };
}

export {
  getPokemons, getInfoPokemon, getHabitatPokemon, getEggGroupsPokemon, getPokemonsQuantity,
};
