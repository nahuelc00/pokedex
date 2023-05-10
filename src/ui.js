/* eslint-disable import/extensions */
/* eslint-disable no-shadow */
/* global  $ */

import {
  getPokemons, getEggGroupsPokemon, getHabitatPokemon, getInfoPokemon,
  infoUrl,
} from './pokemon.js';
import { convertHectogramToKilogram, calculateTotalStat, capitalizeFirstLetter } from './logic.js';

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
  const card = `
  <div id=${id} class="card-pokemon card ms-3 me-3 mb-4 p-3">
  
    <div class="d-flex card-pokemon__container-img justify-content-center">
        <img src="${imgUrl}" class="card-pokemon__img mb-3" alt="${namePokemon}">
    </div>
  
    <p class="m-0 mb-3 card-pokemon__name text-center">${capitalizeFirstLetter(namePokemon)}</p>
  
    <div class="d-flex card-pokemon__container-types gap-4 justify-content-center align-items-center">
        ${typesArray.map((type) => `<p class="card-text card-pokemon__type ${type} m-0 rounded p-1">${capitalizeFirstLetter(type)}</p>`)}
    </div>
  
    <div class="card-body card-pokemon__description d-none rounded p-2 mb-0 mt-4">
      <div>
        <div class="card-pokemon__container-height-weight mb-2">
            <p class="card-text m-0 mb-2">Height:<span class="ms-3 text-white opacity-75">${height}0 cm</span></p>
            <p class="card-text m-0">Weight:<span class="ms-3 text-white opacity-75">${convertHectogramToKilogram(weight)} Kg</span></p>
        </div>
  
        <div class=" card-pokemon__container-habitat-egg-groups mb-2">
          <div class="mb-2">
            <p class="card-text m-0">Habitat:<span class="ms-3 text-white opacity-75">${capitalizeFirstLetter(habitat)}</span></p>
          </div>
  
          <div> 
            Egg Groups:
            <ul class="m-0"> 
             ${eggGroupsArray.map((eggGroup) => `<li class="text-white opacity-75">${capitalizeFirstLetter(eggGroup)}</li>`)}
            </ul>
          </div>
        </div>
  
        <div class="card-pokemon__container-abilities m-0 ">
            Abilities:
            <ul class="m-0">
                ${abilitiesArray.map((ability) => `<li class="text-white opacity-75">${capitalizeFirstLetter(ability)}</li>`)}
            </ul>
        </div>
      </div>
  
        <div>
          <div class="card-pokemon__container-stats"> Stats:
              <ul class="m-0">
                ${statsArray.map((stat) => `<li>${capitalizeFirstLetter(stat.name)}: <span class="text-white opacity-75">${stat.base_stat}</span>
                </li>`)}
                <li>Total: <span class="text-white opacity-75">${calculateTotalStat(statsArray)}</span></li>
                </ul>
          </div>
        </div>
        
        </div>
  
    </div>
  </div>
   `;
  return card.replace(/,/g, '');
}

function getAndRenderDataPokemons() {
  getPokemons().then((data) => {
    const { pokemons } = data;

    pokemons.forEach((pokemon) => {
      const urlPokemon = pokemon.url;
      const pokemonData = {
        name: '',
        types: [],
        imgUrl: '',
        height: '',
        weight: '',
        id: 0,
        abilities: [],
        stats: [],
        habitat: '',
        eggGroups: [],
      };

      getInfoPokemon(urlPokemon)
        .then((data) => {
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

          getHabitatPokemon(data.name).then((data) => {
            pokemonData.habitat = data.habitat;
          }).then(() => {
            getEggGroupsPokemon(data.name).then((data) => {
              data.eggGroups.forEach((eggGroup) => {
                pokemonData.eggGroups.push(eggGroup);
              });

              return pokemonData;
            }).then((data) => {
              const $card = createCardPokemon(
                data.name,
                data.types,
                data.imgUrl,
                data.height,
                data.weight,
                data.id,
                data.abilities,
                data.stats,
                data.habitat,
                data.eggGroups,
              );

              const cardId = $.parseHTML($card)[1].id;
              renderCard($card);

              $(`#${cardId}`).on('click', function () { /* eslint func-names: */
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
    getAndRenderDataPokemons();
  });
}

function goPreviousPage(infoUrl) {
  $('.link-navigation-back').on('click', () => {
    // eslint-disable-next-line no-param-reassign
    infoUrl.page = 'previous';
    $('.container-cards-pokemons').empty();
    getAndRenderDataPokemons();
  });
}

function listenNavigationOfPage() {
  goNextPage(infoUrl);
  goPreviousPage(infoUrl);
}

export { getAndRenderDataPokemons, rotatePokeballs, listenNavigationOfPage };
