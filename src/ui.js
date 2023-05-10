/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* global  $ */

import {
  getPokemons, getEggGroupsPokemon, getHabitatPokemon, getInfoPokemon,
  infoUrl,
} from './pokemon.js';
import { convertHectogramToKilogram, calculateTotalStat, capitalizeFirstLetter } from './utilities.js';

function renderCard($card) {
  $('.container-cards-pokemons').append($card);
}

function rotatePokeballs() {
  $('.header__img-pokeball-1').on('click', () => {
    $('.header__img-pokeball-1').addClass('rotate-pokeball');
    $('.header__img-pokeball-1').css('pointer-events', 'none');
    setTimeout(() => {
      $('.header__img-pokeball-1').removeClass('rotate-pokeball');
      $('.header__img-pokeball-1').css('pointer-events', 'initial');
    }, 2500);
  });

  $('.header__img-pokeball-2').on('click', () => {
    $('.header__img-pokeball-2').addClass('rotate-pokeball');
    $('.header__img-pokeball-2').css('pointer-events', 'none');
    setTimeout(() => {
      $('.header__img-pokeball-2').removeClass('rotate-pokeball');
      $('.header__img-pokeball-2').css('pointer-events', 'initial');
    }, 2500);
  });

  $('.footer__img-pokeball').on('click', () => {
    $('.footer__img-pokeball').addClass('rotate-pokeball');
    $('.footer__img-pokeball').css('pointer-events', 'none');
    setTimeout(() => {
      $('.footer__img-pokeball').removeClass('rotate-pokeball');
      $('.footer__img-pokeball').css('pointer-events', 'initial');
    }, 2500);
  });
}

function closeCard($card) {
  $('.img-close-card').on('click', () => {
    $($card).addClass('d-none');
    $($card).children('.card-pokemon__container-img').children('.card-pokemon__img').removeClass('img-pokemon-expanded');
    $($card).removeClass('card-expanded');
    $($card).children('.card-pokemon__description').addClass('d-none');
    $($card).removeClass('border-0');

    $('.img-close-card').addClass('d-none');
    $('.card-pokemon').removeClass('d-none');
    $('nav').removeClass('d-none');
  });
}

function createCardPokemon(
  namePokemon,
  typesArray,
  imgUrl,
  height,
  weight,
  id,
  abilitiesArray,
  statsArray,
  habitat,
  eggGroupsArray,
) {
  const $templateCardPokemon = $('.template-card-pokemon');
  const clone = $templateCardPokemon[0].content.cloneNode(true);

  $(clone).find('.card-pokemon').attr('id', id);
  const $img = $(clone).find('.card-pokemon__img');
  const $namePokemon = $(clone).find('.card-pokemon__name');
  const $containerTypes = $(clone).find('.card-pokemon__container-types');
  const $height = $(clone).find('.card-pokemon__height > span');
  const $weight = $(clone).find('.card-pokemon__weight > span');
  const $habitat = $(clone).find('.card-pokemon__habitat > span');
  const $eggGroups = $(clone).find('.card-pokemon__egg-groups');
  const $abilities = $(clone).find('.card-pokemon__abilities');
  const $stats = $(clone).find('.card-pokemon__stats');

  $img.attr('src', imgUrl);
  $img.attr('alt', namePokemon);

  $namePokemon.text(capitalizeFirstLetter(namePokemon));

  typesArray.forEach((type) => {
    $containerTypes.append(`<p class="card-text card-pokemon__type ${type} m-0 rounded p-1">${capitalizeFirstLetter(type)}</p>`);
  });

  $height.text(`${height}0 cm`);
  $weight.text(`${convertHectogramToKilogram(weight)} Kg`);
  $habitat.text(capitalizeFirstLetter(habitat));

  eggGroupsArray.forEach((eggGroup) => {
    $eggGroups.append(`<li class="text-white opacity-75">${capitalizeFirstLetter(eggGroup)}</li>`);
  });

  abilitiesArray.forEach((ability) => {
    $abilities.append(`<li class="text-white opacity-75">${capitalizeFirstLetter(ability)}</li>`);
  });

  statsArray.forEach((stat) => {
    $stats.append(`<li>${capitalizeFirstLetter(stat.name)}: <span class="text-white opacity-75">${stat.base_stat}</span></li>`);
  });
  $stats.append(`<li>Total: <span class="text-white opacity-75">${calculateTotalStat(statsArray)}</span></li>`);

  return $(clone).find('.card-pokemon')[0];
}

function listenClickInCard($card) {
  $($card).on('click', function () { /* eslint func-names: */
    $('.img-close-card').removeClass('d-none');
    $('.card-pokemon').addClass('d-none');
    $('nav').addClass('d-none');
    $(this).removeClass('d-none');
    $(this).addClass('border-0');
    $(this).children('.card-pokemon__description').removeClass('d-none');
    $(this).addClass('card-expanded');
    $(this).children('.card-pokemon__container-img').children('.card-pokemon__img').addClass('img-pokemon-expanded');
    closeCard(this);
  });
}

function getAndRenderPokemons() {
  getPokemons().then((data) => {
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
          };

          pokemonData.id = data.id;
          pokemonData.imgUrl = data.sprites.other.dream_world.front_default;
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
          getHabitatPokemon(pokemonData.name).then((response) => {
            // eslint-disable-next-line no-param-reassign
            pokemonData.habitat = response.habitat;
          }).then(() => {
            // eslint-disable-next-line no-param-reassign
            pokemonData.eggGroups = [];
            getEggGroupsPokemon(pokemonData.name).then((response) => {
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

              renderCard($card);
              const cardId = $($card).attr('id');
              listenClickInCard($(`#${cardId}`));
            });
          });
        });
    });
  });
}

function goNextPage(infoUrl) {
  $('.link-navigation-next').on('click', () => {
    // eslint-disable-next-line no-param-reassign
    infoUrl.page = 'next';
    $('.container-cards-pokemons').empty();
    getAndRenderPokemons();
  });
}

function goPreviousPage(infoUrl) {
  $('.link-navigation-back').on('click', () => {
    if (infoUrl.urlActual !== infoUrl.urlInitial) {
      // eslint-disable-next-line no-param-reassign
      infoUrl.page = 'previous';
      $('.container-cards-pokemons').empty();
      getAndRenderPokemons();
    }
  });
}

function listenNavigationOfPage() {
  goNextPage(infoUrl);
  goPreviousPage(infoUrl);
}

export { getAndRenderPokemons, rotatePokeballs, listenNavigationOfPage };
