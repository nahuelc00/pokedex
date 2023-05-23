/* eslint-disable import/extensions */
/* global  $ */

import { convertHectogramToKilogram, calculateTotalStat, capitalizeFirstLetter } from '../utilities/utilities.js';

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

function createCardPokemon(pokemonData, templateCardPokemon) {
  const $cardPokemon = $(templateCardPokemon);

  $cardPokemon.attr('id', pokemonData.id);

  const $img = $cardPokemon.find('.card-pokemon__img');
  const $namePokemon = $cardPokemon.find('.card-pokemon__name');
  const $containerTypes = $cardPokemon.find('.card-pokemon__container-types');
  const $height = $cardPokemon.find('.card-pokemon__height > span');
  const $weight = $cardPokemon.find('.card-pokemon__weight > span');
  const $habitat = $cardPokemon.find('.card-pokemon__habitat > span');
  const $eggGroups = $cardPokemon.find('.card-pokemon__egg-groups');
  const $abilities = $cardPokemon.find('.card-pokemon__abilities');
  const $stats = $cardPokemon.find('.card-pokemon__stats');

  $img.attr('src', pokemonData.imgUrl);
  $img.attr('alt', pokemonData.name);

  $namePokemon.text(capitalizeFirstLetter(pokemonData.name));

  pokemonData.types.forEach((type) => {
    $containerTypes.append(`<p class="card-text card-pokemon__type ${type} m-0 rounded p-1">${capitalizeFirstLetter(type)}</p>`);
  });

  $height.text(`${pokemonData.height}0 cm`);
  $weight.text(`${convertHectogramToKilogram(pokemonData.weight)} Kg`);
  $habitat.text(capitalizeFirstLetter(pokemonData.habitat));

  pokemonData.eggGroups.forEach((eggGroup) => {
    $eggGroups.append(`<li class="text-white opacity-75">${capitalizeFirstLetter(eggGroup)}</li>`);
  });

  pokemonData.abilities.forEach((ability) => {
    $abilities.append(`<li class="text-white opacity-75">${capitalizeFirstLetter(ability)}</li>`);
  });

  pokemonData.stats.forEach((stat) => {
    $stats.append(`<li>${capitalizeFirstLetter(stat.name)}: <span class="text-white opacity-75">${stat.base_stat}</span></li>`);
  });
  $stats.append(`<li>Total: <span class="text-white opacity-75">${calculateTotalStat(pokemonData.stats)}</span></li>`);

  return $cardPokemon[0];
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

export { renderCard, createCardPokemon, listenClickInCard };
