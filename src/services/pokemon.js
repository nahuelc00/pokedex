/* eslint-disable import/extensions */
import * as api from '../api/pokemon.js';

async function getPokemons() {
  const pokemons = await api.getPokemonsFromApi();
  return { pokemons };
}

function getHabitat(infoOfSpecie) {
  if (infoOfSpecie.habitat) {
    return infoOfSpecie.habitat.name;
  }
  return 'no-habitat';
}

function getEggGroups(infoOfSpecie) {
  const eggGroups = [];
  infoOfSpecie.egg_groups.forEach((eggGroup) => {
    eggGroups.push(eggGroup.name);
  });
  return eggGroups;
}

async function getInfoOfSpecie(idPokemon) {
  const infoSpecie = await api.getInfoOfSpecieFromApi(idPokemon);
  return infoSpecie;
}

async function getPokemonsQuantity() {
  const quantity = await api.getPokemonsQuantityFromApi();
  return quantity;
}

async function getInfoPokemon(urlPokemon) {
  const infoPokemonJson = await api.getInfoPokemonFromApi(urlPokemon);
  return infoPokemonJson;
}

export {
  getPokemons, getInfoPokemon, getPokemonsQuantity,
  getInfoOfSpecie, getHabitat, getEggGroups,
};
