/// <reference types="Cypress" />

/* eslint-disable import/extensions */
/* global cy it beforeEach context */
/* eslint no-shadow: */

import { calculateTotalStat, capitalizeFirstLetter, convertHectogramToKilogram } from '../../src/utilities.js';

const URL = '127.0.0.1:8080';

context('Pokedex', () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  it('ejecute click in pokemon and verify the information', () => {
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

    cy.intercept('https://pokeapi.co/api/v2/pokemon/6').as('getCharizard');
    cy.wait('@getCharizard').then((data) => {
      const infoPokemon = data.response.body;
      pokemonData.name = infoPokemon.name;
      pokemonData.imgUrl = infoPokemon.sprites.other.dream_world.front_default;
      pokemonData.height = infoPokemon.height;
      pokemonData.weight = infoPokemon.weight;

      infoPokemon.types.forEach((type) => {
        pokemonData.types.push(type.type.name);
      });

      infoPokemon.abilities.forEach((ability) => {
        pokemonData.abilities.push(ability.ability.name);
      });

      infoPokemon.stats.forEach((stat) => {
        pokemonData.stats.push({ name: stat.stat.name, base_stat: stat.base_stat });
      });
    });

    cy.intercept('https://pokeapi.co/api/v2/pokemon-species/6').as('getMoreInfoCharizard');
    cy.wait('@getMoreInfoCharizard').then((data) => {
      const infoPokemon = data.response.body;
      pokemonData.habitat = infoPokemon.habitat;
      infoPokemon.egg_groups.forEach((eggGroup) => {
        pokemonData.eggGroups.push(eggGroup);
      });
    }).then(() => {
      cy.get('#6').find('.card-pokemon__container-types').children().eq(0)
        .should('have.text', capitalizeFirstLetter(pokemonData.types[0]));
      cy.get('#6').find('.card-pokemon__container-types').children().eq(1)
        .should('have.text', capitalizeFirstLetter(pokemonData.types[1]));

      cy.get('#6').click();
      cy.get('#6').find('.card-pokemon__height').children()
        .should('have.text', '170 cm');

      cy.get('#6').find('.card-pokemon__weight').children()
        .should('have.text', `${convertHectogramToKilogram(pokemonData.weight)} Kg`);

      cy.get('#6').find('.card-pokemon__egg-groups').children().eq(0)
        .should('have.text', capitalizeFirstLetter(pokemonData.eggGroups[0].name));
      cy.get('#6').find('.card-pokemon__egg-groups').children().eq(1)
        .should('have.text', capitalizeFirstLetter(pokemonData.eggGroups[1].name));

      cy.get('#6').find('.card-pokemon__abilities').children().eq(0)
        .should('have.text', capitalizeFirstLetter(pokemonData.abilities[0]));
      cy.get('#6').find('.card-pokemon__abilities').children().eq(1)
        .should('have.text', capitalizeFirstLetter(pokemonData.abilities[1]));

      cy.get('#6').find('.card-pokemon__stats').children().each(($stat, index) => {
        if (index < 6) {
          cy.get('#6').find($stat)
            .should('have.text', `${capitalizeFirstLetter(pokemonData.stats[index].name)}: ${pokemonData.stats[index].base_stat}`);
        } else {
          cy.get('#6').find($stat)
            .should('have.text', `Total: ${calculateTotalStat(pokemonData.stats)}`);
        }
      });

      cy.get('.img-close-card').click();
      cy.get('#6').should('not.have.class', 'card-expanded');
    });
  });

  it('verifies next page', () => {
    cy.intercept('https://pokeapi.co/api/v2/pokemon-species/20').as('getUltimatePokemonInfo');
    cy.intercept('https://pokeapi.co/api/v2/pokemon-species/40').as('getUltimatePokemonOfNextPage');

    cy.wait('@getUltimatePokemonInfo').then(() => {
      cy.wait(500);
      cy.get('.link-navigation-next').click();
      cy.get('.number-page').should('have.value', 2);
    });

    cy.wait('@getUltimatePokemonOfNextPage').then(() => {
      cy.wait(2000);
      cy.get('.card-pokemon').should('have.length', 20);
    });
  });

  it('verifies previous page', () => {
    cy.intercept('https://pokeapi.co/api/v2/pokemon-species/20').as('getUltimatePokemonInfo');
    cy.get('.link-navigation-back').click();
    cy.get('.number-page').should('have.value', 1);

    cy.wait('@getUltimatePokemonInfo').then(() => {
      cy.get('.card-pokemon').should('have.length', 20);
    });
  });
});
