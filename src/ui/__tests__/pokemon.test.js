/* global  $ */

// eslint-disable-next-line import/extensions
import { capitalizeFirstLetter, convertHectogramToKilogram, calculateTotalStat } from '../../utilities/utilities.js';
// eslint-disable-next-line import/extensions
import { renderCard, createCardPokemon, listenClickInCard } from '../pokemon.js';

// eslint-disable-next-line no-multi-assign, import/extensions
global.jQuery = global.$ = require('../../../node_modules/jquery/dist/jquery.slim.js');

test('create pokemon card', () => {
  document.body.innerHTML = `
    <template class="template-card-pokemon">
    <div class="card-pokemon card">
        <div class="card-pokemon__container-img"><img class="card-pokemon__img"></div>
        <p class="card-pokemon__name"></p>
        <div class="card-pokemon__container-types"></div>
        <div class="card-body card-pokemon__description">
            <div>
                <div class="card-pokemon__container-height-weight">
                    <p class="card-pokemon__height card-text">Height:<span></span></p>
                    <p class="card-pokemon__weight card-text">Weight:<span></span></p>
                </div>
                <div class="card-pokemon__container-habitat-egg-groups">
                    <div>
                        <p class="card-pokemon__habitat card-text">Habitat:<span></span></p>
                    </div>
                    <div>
                        Egg Groups:
                        <ul class="card-pokemon__egg-groups"></ul>
                    </div>
                </div>
                <div class="card-pokemon__container-abilities">
                    Abilities:
                    <ul class="card-pokemon__abilities"></ul>
                </div>
            </div>
            <div>
                <div class="card-pokemon__container-stats"> Stats:
                    <ul class="card-pokemon__stats"></ul>
                </div>
            </div>
        </div>
    </div>
    </div>
</template>`;

  const pokemonDataMock = {
    name: 'pokemon mockasdsad',
    types: ['type1', 'type2'],
    imgUrl: 'https://imgpokemon.com',
    height: '23',
    weight: '300',
    id: 999,
    abilities: ['ability1', 'ability2'],
    stats: [{ name: 'stat1', base_stat: 99 }, { name: 'stat2', base_stat: 100 }],
    eggGroups: ['eggGroup1', 'eggGroup2'],
    habitat: 'habitatMock',
  };

  const templateCardPokemon = $('.template-card-pokemon').html();

  const $cardMock = createCardPokemon(pokemonDataMock, templateCardPokemon);

  expect(Number($($cardMock).attr('id'))).toBe(pokemonDataMock.id);

  expect($($cardMock).find('.card-pokemon__img').attr('src'))
    .toBe(pokemonDataMock.imgUrl);

  expect($($cardMock).find('.card-pokemon__name').text())
    .toBe(capitalizeFirstLetter(pokemonDataMock.name));

  expect($($cardMock).find('.card-pokemon__height span').text())
    .toBe(`${pokemonDataMock.height}0 cm`);

  expect($($cardMock).find('.card-pokemon__weight span').text())
    .toBe(`${convertHectogramToKilogram(pokemonDataMock.weight)} Kg`);

  expect($($cardMock).find('.card-pokemon__habitat').text())
    .toBe(`Habitat:${capitalizeFirstLetter(pokemonDataMock.habitat)}`);

  const $types = $($cardMock).find('.card-pokemon__type');
  $types.each((index, $type) => {
    const typeText = $($type).text();
    const typeTextExpected = capitalizeFirstLetter(pokemonDataMock.types[index]);
    expect(typeText).toBe(typeTextExpected);
  });

  const $eggGroups = $($cardMock).find('.card-pokemon__egg-groups > li');
  $eggGroups.each((index, $eggGroup) => {
    const eggGroupText = $($eggGroup).text();
    const eggGroupTextExpected = capitalizeFirstLetter(pokemonDataMock.eggGroups[index]);
    expect(eggGroupText).toBe(eggGroupTextExpected);
  });

  const $abilities = $($cardMock).find('.card-pokemon__abilities > li');
  $abilities.each((index, $abilitie) => {
    const abilitieText = $($abilitie).text();
    const abilitieTextExpected = capitalizeFirstLetter(pokemonDataMock.abilities[index]);
    expect(abilitieText).toBe(abilitieTextExpected);
  });

  const $stats = $($cardMock).find('.card-pokemon__stats > li');
  $stats.each((index, $stat) => {
    const statText = $($stat).text();
    if (index < 2) {
      const statTextMock = pokemonDataMock.stats[index].name;
      const statBaseMock = pokemonDataMock.stats[index].base_stat;
      const textExpected = `${capitalizeFirstLetter(statTextMock)}: ${statBaseMock}`;
      expect(statText).toBe(textExpected);
    } else {
      expect(statText).toBe(`Total: ${calculateTotalStat(pokemonDataMock.stats)}`);
    }
  });
});

test('render pokemon card', () => {
  document.body.innerHTML = '<div class="container-cards-pokemons"></div>';
  const $cardPokemonMock = $('<div class="card-pokemon"></div>');
  renderCard($cardPokemonMock);

  expect(document.querySelectorAll('.container-cards-pokemons')[0].outerHTML)
    .toEqual('<div class="container-cards-pokemons"><div class="card-pokemon"></div></div>');
});

test('open and close card', () => {
  document.body.innerHTML = `
  <img class="img-close-card d-none" src="./imgs/close.png" alt="close-card">
  <div class="card-pokemon card-clicked">
    <div class="card-pokemon__container-img"><img class="card-pokemon__img"></div>
    <div class="card-body card-pokemon__description"></div>
  </div>
  <div class="card-pokemon"></div>
  <div class="card-pokemon"></div>
  <nav>
    <ul class="container-pagination pagination pagination-lg justify-content-center"></ul>
  </nav>  
  `;

  const $card = $('.card-clicked');
  listenClickInCard($card);
  $card.trigger('click');

  const $cardsPokemons = $('.card-pokemon');
  $cardsPokemons.each((index, $cardPokemon) => {
    const isClickedCard = $cardPokemon.classList.contains('card-clicked');
    if (!isClickedCard) {
      expect($cardPokemon.className).toContain('d-none');
    } else {
      expect($cardPokemon.className).toContain('card-expanded');
      expect($cardPokemon.className).toContain('border-0');
    }
  });

  const $nav = $('nav');
  const isNavHidden = $nav.hasClass('d-none');
  expect(isNavHidden).toBe(true);

  const $descriptionPokemon = $('.card-pokemon__description');
  const isDescriptionHidden = $descriptionPokemon.hasClass('d-none');
  expect(isDescriptionHidden).toBe(false);

  const $imgPokemon = $('.card-pokemon__img');
  const isImgExpanded = $imgPokemon.hasClass('img-pokemon-expanded');
  expect(isImgExpanded).toBe(true);

  const $imgCloseCard = $('.img-close-card');
  const isImgHidden = $imgCloseCard.hasClass('d-none');
  expect(isImgHidden).toBe(false);

  $imgCloseCard.trigger('click');

  $cardsPokemons.each((index, $cardPokemon) => {
    const isCardHidden = $cardPokemon.className.includes('d-none');
    expect(isCardHidden).toBe(false);
  });
  expect($descriptionPokemon.hasClass('d-none')).toBe(true);
  expect($imgPokemon.hasClass('img-pokemon-expanded')).toBe(false);
  expect($imgCloseCard.hasClass('d-none')).toBe(true);
  expect($nav.hasClass('d-none')).toBe(false);
});
