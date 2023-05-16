/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* global  $ */

// 57:21
import {
  getPokemons, getEggGroupsPokemon, getHabitatPokemon, getInfoPokemon,
} from '../services/pokemon.js';

import { createCardPokemon, renderCard, listenClickInCard } from './pokemon.js';

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
      const urlPokemon = pokemon.url;

      getInfoPokemon(urlPokemon)
        .then((data) => {
          const pokemonData = {
            name: '',
            types: [],
            imgUrl: '',
            height: '',
            weight: '',
            id: 0,
            abilities: [],
            stats: [],
            eggGroups: [],
            habitat: '',
          };

          pokemonData.id = data.id;
          pokemonData.imgUrl = data.sprites.other.dream_world.front_default
            || data.sprites.other['official-artwork'].front_default
            || data.sprites.front_default;
          pokemonData.name = data.name;
          pokemonData.weight = data.weight;
          pokemonData.height = data.height;

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
          if (pokemonData.id > 10000) {
            // eslint-disable-next-line no-param-reassign
            pokemonData.habitat = 'no-habitat';
            // eslint-disable-next-line no-param-reassign
            pokemonData.eggGroups = ['no-egg-groups'];
            const $card = createCardPokemon(
              pokemonData.name,
              pokemonData.types,
              pokemonData.imgUrl,
              pokemonData.height,
              pokemonData.weight,
              pokemonData.id,
              pokemonData.abilities,
              pokemonData.stats,
              pokemonData.habitat,
              pokemonData.eggGroups,
            );
            removeLoader();
            renderCard($card);
            const cardId = $($card).attr('id');
            listenClickInCard($(`#${cardId}`));
          } else {
            getHabitatPokemon(pokemonData.id).then((response) => {
              // eslint-disable-next-line no-param-reassign
              pokemonData.habitat = response.habitat;
            }).then(() => {
              // eslint-disable-next-line no-param-reassign
              pokemonData.eggGroups = [];
              getEggGroupsPokemon(pokemonData.id).then((response) => {
                response.eggGroups.forEach((eggGroup) => {
                  pokemonData.eggGroups.push(eggGroup);
                });
              }).then(() => {
                const $card = createCardPokemon(
                  pokemonData.name,
                  pokemonData.types,
                  pokemonData.imgUrl,
                  pokemonData.height,
                  pokemonData.weight,
                  pokemonData.id,
                  pokemonData.abilities,
                  pokemonData.stats,
                  pokemonData.habitat,
                  pokemonData.eggGroups,
                );
                removeLoader();
                renderCard($card);
                const cardId = $($card).attr('id');
                listenClickInCard($(`#${cardId}`));
              });
            });
          }
        });
    });
  });
}

export { getAndRenderPokemons };
