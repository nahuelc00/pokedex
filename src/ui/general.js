/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* global  $ */

import {
  getPokemons, getHabitat, getEggGroups,
  getInfoPokemon, getInfoOfSpecie,
} from '../services/pokemon.js';

import { checkPokemonHasSpecie } from '../validations/validations.js';

import { createCardPokemon, renderCard, listenClickInCard } from './pokemon.js';

import { setPokemonInStorage, getPokemonFromStorage } from '../storage/storage.js';

class Pokemon {
  constructor(pokemonData) {
    this.name = pokemonData.name;
    this.types = pokemonData.types.map((type) => type.type.name);
    this.imgUrl = pokemonData.sprites.other.dream_world.front_default
      || pokemonData.sprites.other['official-artwork'].front_default || pokemonData.sprites.front_default;
    this.height = pokemonData.height;
    this.weight = pokemonData.weight;
    this.id = pokemonData.id;
    this.abilities = pokemonData.abilities.map((ability) => ability.ability.name);
    this.stats = pokemonData.stats.map((stat) => ({
      name: stat.stat.name,
      base_stat: stat.base_stat,
    }));
    this.eggGroups = [];
    this.habitat = '';
  }

  setHabitat(habitat) {
    this.habitat = habitat;
  }

  setEggGroups(eggGroups) {
    eggGroups.forEach((eggGroup) => {
      this.eggGroups.push(eggGroup);
    });
  }
}

function removeLoader() {
  $('.loader').removeClass('d-flex').addClass('d-none');
}

function renderLoader() {
  $('.loader').removeClass('d-none').addClass('d-flex');
}

function getAndRenderPokemons() {
  renderLoader();
  const templateCardPokemon = $('.template-card-pokemon').html();

  return getPokemons().then((data) => {
    const { pokemons } = data;

    pokemons.forEach((pokemon) => {
      const pokemonInStorage = getPokemonFromStorage(pokemon.name);
      if (pokemonInStorage) {
        const $card = createCardPokemon(pokemonInStorage, templateCardPokemon);
        removeLoader();
        renderCard($card);
        const cardId = $($card).attr('id');
        listenClickInCard($(`#${cardId}`));
      } else {
        const urlPokemon = pokemon.url;
        getInfoPokemon(urlPokemon)
          .then((data) => {
            const pokemon = new Pokemon(data);
            return pokemon;
          }).then((pokemon) => {
            const hasSpecie = checkPokemonHasSpecie(pokemon.id);

            if (!hasSpecie) {
              pokemon.setHabitat('no-habitat');
              pokemon.setEggGroups(['no-egg-groups']);

              const $card = createCardPokemon(pokemon, templateCardPokemon);
              setPokemonInStorage(pokemon.name, pokemon);

              removeLoader();
              renderCard($card);
              const cardId = $($card).attr('id');
              listenClickInCard($(`#${cardId}`));
            } else {
              getInfoOfSpecie(pokemon.id).then((infoOfSpecie) => {
                const habitat = getHabitat(infoOfSpecie);
                const eggGroups = getEggGroups(infoOfSpecie);

                pokemon.setHabitat(habitat);
                pokemon.setEggGroups(eggGroups);

                const $card = createCardPokemon(pokemon, templateCardPokemon);

                setPokemonInStorage(pokemon.name, pokemon);

                removeLoader();
                renderCard($card);
                const cardId = $($card).attr('id');
                listenClickInCard($(`#${cardId}`));
              });
            }
          });
      }
    });
  });
}

export { getAndRenderPokemons };
