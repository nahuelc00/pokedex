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

function removeLoader() {
  $('.loader').removeClass('d-flex').addClass('d-none');
}

function renderLoader() {
  $('.loader').removeClass('d-none').addClass('d-flex');
}

function getAndRenderPokemons() {
  renderLoader();
  return getPokemons().then((data) => {
    const { pokemons } = data;

    pokemons.forEach((pokemon) => {
      const pokemonInStorage = getPokemonFromStorage(pokemon.name);
      if (pokemonInStorage) {
        const $card = createCardPokemon(pokemonInStorage);
        removeLoader();
        renderCard($card);
        const cardId = $($card).attr('id');
        listenClickInCard($(`#${cardId}`));
      } else {
        const urlPokemon = pokemon.url;
        getInfoPokemon(urlPokemon)
          .then((data) => {
            const pokemonData = {
              name: data.name,
              types: [],
              imgUrl: data.sprites.other.dream_world.front_default
              || data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
              height: data.height,
              weight: data.weight,
              id: data.id,
              abilities: [],
              stats: [],
              eggGroups: [],
              habitat: '',
            };

            data.types.forEach((type) => {
              pokemonData.types.push(type.type.name);
            });

            data.abilities.forEach((ability) => {
              pokemonData.abilities.push(ability.ability.name);
            });

            data.stats.forEach((stat) => {
              pokemonData.stats.push({ name: stat.stat.name, base_stat: stat.base_stat });
            });

            return pokemonData;
          }).then((pokemonData) => {
            const hasSpecie = checkPokemonHasSpecie(pokemonData.id);

            if (!hasSpecie) {
              // eslint-disable-next-line no-param-reassign
              pokemonData.habitat = 'no-habitat';
              // eslint-disable-next-line no-param-reassign
              pokemonData.eggGroups = ['no-egg-groups'];
              const $card = createCardPokemon(pokemonData);

              setPokemonInStorage(pokemonData.name, pokemonData);

              removeLoader();
              renderCard($card);
              const cardId = $($card).attr('id');
              listenClickInCard($(`#${cardId}`));
            } else {
              getInfoOfSpecie(pokemonData.id).then((infoOfSpecie) => {
                const habitat = getHabitat(infoOfSpecie);
                const eggGroups = getEggGroups(infoOfSpecie);
                // eslint-disable-next-line no-param-reassign
                pokemonData.habitat = habitat;

                eggGroups.forEach((eggGroup) => {
                  pokemonData.eggGroups.push(eggGroup);
                });

                const $card = createCardPokemon(pokemonData);

                setPokemonInStorage(pokemonData.name, pokemonData);

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
