/// <reference types="Cypress" />

/* eslint-disable import/extensions */
/* global cy it context */
/* eslint no-shadow: */

import { calculateTotalStat, capitalizeFirstLetter, convertHectogramToKilogram } from '../../src/logic.js';

const URL_API = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20';
const URL = '127.0.0.1:8080';

context('Pokedex', () => {
  it('verify that the pokemon data is shown correctly', () => {
    cy.visit(URL);
    cy.intercept(URL_API).as('getPokemons');
    cy.wait('@getPokemons').then((response) => {
      const pokemons = response.response.body.results;
      return pokemons;
    }).then((data) => {
      const pokemon = data[data.length - 1];

      cy.intercept(pokemon.url).as(`get${pokemon.name}`);

      cy.wait(`@get${pokemon.name}`)
        .then((response) => {
          const pokemonInfo = response.response.body;

          return pokemonInfo;
        })
        .then((data) => {
          const { stats } = data;
          const { abilities } = data;
          const { types } = data;
          const { name } = data;
          const img = data.sprites.other.dream_world.front_default;
          const { id } = data;
          const { height } = data;
          const { weight } = data;

          return {
            name, img, types, id, height, weight, abilities, stats,
          };
        })
        .then((data) => {
          cy.get(`#${data.id}`).find('img').should('have.attr', 'src', data.img);
          cy.get(`#${data.id}`).find('.card-pokemon__name').should('have.text', capitalizeFirstLetter(data.name));

          data.types.forEach((type, index) => {
            cy.get(`#${data.id}`).find('.card-pokemon__type').eq(index)
              .should('have.text', capitalizeFirstLetter(type.type.name));
          });

          cy.get(`#${data.id}`).click();

          cy.get('.card-pokemon').each(($card) => {
            if ($card[0].id === data.id.toString()) {
              cy.get($card).should('have.not.class', 'd-none');
            } else {
              cy.get($card).should('have.class', 'd-none');
            }
          });

          cy.get('.img-close-card').should('have.not.class', 'd-none');

          data.abilities.forEach((ability, index) => {
            cy.get(`#${data.id}`).find('.card-pokemon__container-abilities > ul > li').eq(index)
              .should('have.text', capitalizeFirstLetter(ability.ability.name));
          });

          data.stats.forEach((stats, index) => {
            cy.get(`#${data.id}`).find('.card-pokemon__container-stats > ul > li').eq(index)
              .contains(`${capitalizeFirstLetter(stats.stat.name)}: ${stats.base_stat}`);
          });
          cy.get(`#${data.id}`).find('.card-pokemon__container-stats > ul > li').last()
            .contains(`Total: ${calculateTotalStat(data.stats)}`);

          cy.get(`#${data.id}`).find('.card-pokemon__container-height-weight > p').eq(0)
            .find('span')
            .should('have.text', `${data.height}0 cm`);

          cy.get(`#${data.id}`).find('.card-pokemon__container-height-weight > p').eq(1)
            .find('span')
            .should('have.text', `${convertHectogramToKilogram(data.weight)} Kg`);

          cy.get(`#${data.id}`).find('.card-pokemon__container-habitat-egg-groups').find('p').contains('Habitat:Grassland');

          cy.get(`#${data.id}`).find('.card-pokemon__container-habitat-egg-groups').find('ul').contains('Ground');

          cy.get('.img-close-card').click();

          cy.get('.card-pokemon').each(($card) => {
            cy.get($card).should('have.not.class', 'd-none');
          });
        });
    });
  });
});
