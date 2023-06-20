/* eslint-disable max-classes-per-file */
/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* global  $ */

import {
  getPokemons, getHabitat, getEggGroups,
  getInfoPokemon, getInfoOfSpecie,
} from '../services/pokemon.js';

import { checkPokemonHasSpecie } from '../validations/validations.js';

import { createCardPokemon, renderCard, listenClickInCard } from './pokemon.js';

import { mapPokemon } from '../mappers/mapPokemon.js';
import { mapPokemons } from '../mappers/mapPokemons.js';

import { setPokemonInStorage, getPokemonFromStorage } from '../storage/storage.js';

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
    const pokemons = mapPokemons(data);

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
            const pokemon = mapPokemon(data);

            pokemon.setHabitat('');
            pokemon.setEggGroups(['']);

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
