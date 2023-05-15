/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* global  $ */

import {
  getPokemons, getEggGroupsPokemon, getHabitatPokemon, getInfoPokemon,
  infoUrl, getPokemonsQuantity, updateUrlActual,
} from './pokemon.js';
import { convertHectogramToKilogram, calculateTotalStat, capitalizeFirstLetter } from './utilities.js';

function renderCard($card) {
  $('.container-cards-pokemons').append($card);
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

function removeLoader() {
  $('.loader').removeClass('d-flex').addClass('d-none');
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

function renderPagination() {
  return getPokemonsQuantity().then((quantity) => {
    const $containerItemsPagination = $('.container-pagination');
    $containerItemsPagination.append('<li class="page-item link-navigation-back"><a class="page-link rounded-pill" href="#"><--</a></li>');
    $containerItemsPagination.append(`<li class="page-item text-primary fs-2 ms-3 me-3 d-grid align-content-center"><input class="text-primary border-top-0 border-start-0 border-end-0 number-page text-center" type="text" value="${infoUrl.numberOfPageActual}"></li>`);
    $containerItemsPagination.append(`<li class="page-item text-primary fs-2 ms-3 me-3 d-grid align-content-center"><input disabled class="bg-transparent opacity-75 text-primary border-0 number-page text-center" type="text" value="${Math.floor(quantity / infoUrl.limitOfPokemons)}"></li>`);
    $containerItemsPagination.append('<li class="page-item link-navigation-next"><a class="page-link rounded-pill" href="#">GO</a></li>');
  });
}

function goNextPage() {
  $('.link-navigation-next').on('click', async () => {
    const limitPerPage = infoUrl.limitOfPokemons;
    const quantityPokemons = await getPokemonsQuantity();
    const $numberPage = $('.number-page');
    const totalPages = Math.floor(quantityPokemons / limitPerPage);
    const enteredPage = Number($numberPage.val());

    if (Number.isNaN(enteredPage)) {
      $('.number-page').addClass('border-danger');
      return;
    }
    if (enteredPage < 0) {
      $('.number-page').addClass('border-danger');
      return;
    }
    if (enteredPage === 0) {
      $('.number-page').addClass('border-danger');
      return;
    }

    $('.number-page').removeClass('border-danger');

    if (enteredPage !== infoUrl.numberOfPageActual) {
      if (enteredPage < totalPages || enteredPage === totalPages) {
        infoUrl.numberOfPageActual = Number($('.number-page').val());
        if (infoUrl.numberOfPageActual === 1) {
          infoUrl.numberOfPageActual = 1;
          infoUrl.offset = 0;
          updateUrlActual(infoUrl.offset);
        } else {
          infoUrl.offset = infoUrl.numberOfPageActual * infoUrl.limitOfPokemons;
          updateUrlActual(infoUrl.offset);
        }
      } else {
        $('.number-page').addClass('border-danger');
        return;
      }
    } else if (enteredPage === totalPages) {
      $('.number-page').addClass('border-danger');
      return;
    } else {
      infoUrl.numberOfPageActual += 1;
      infoUrl.offset += 20;
      updateUrlActual(infoUrl.offset);
    }

    $('.container-cards-pokemons').empty();
    $('.container-pagination').empty();
    await getAndRenderPokemons();
    await renderPagination();
    // eslint-disable-next-line no-use-before-define
    listenNavigationOfPage();
  });
}

function goPreviousPage() {
  $('.link-navigation-back').on('click', async () => {
    if (infoUrl.urlActual !== infoUrl.urlInitial) {
      // eslint-disable-next-line no-param-reassign
      // infoUrl.page = 'previous';
      // eslint-disable-next-line no-param-reassign
      infoUrl.numberOfPageActual -= 1;
      infoUrl.offset -= 20;
      updateUrlActual(infoUrl.offset);
      $('.container-cards-pokemons').empty();
      $('.container-pagination').empty();
      await getAndRenderPokemons();
      await renderPagination();
      // eslint-disable-next-line no-use-before-define
      listenNavigationOfPage();
    }
  });
}

function listenNavigationOfPage() {
  goNextPage();
  goPreviousPage();
}

export {
  getAndRenderPokemons, listenNavigationOfPage, renderPagination,
};
