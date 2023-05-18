/// <reference types="Cypress" />

/* eslint-disable import/extensions */
/* global cy it describe beforeEach context */
/* eslint no-shadow: */

import { calculateTotalStat, capitalizeFirstLetter, convertHectogramToKilogram } from '../../src/utilities/utilities.js';

const URL = '127.0.0.1:8080';

function verifyNameOfPokemons(pokemons) {
  cy.get('.card-pokemon').each(($cardPokemon) => {
    const pokemonNameOfCard = $cardPokemon.find('.card-pokemon__name').text();
    const pokemon = pokemons.find((pokemon) => capitalizeFirstLetter(pokemon.name)
      === pokemonNameOfCard);
    cy.get($cardPokemon).find('.card-pokemon__name').should('have.text', capitalizeFirstLetter(pokemon.name));
  });
}

context('Pokedex', () => {
  beforeEach(() => {
    cy.visit(URL);
  });

  it('Verify pokemons of page', () => {
    cy.intercept('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20', { fixture: 'list-page-1.json' })
      .as('getPokemonsOfPage1');
    cy.get('.number-page:enabled').should('have.value', 1);
    cy.get('.number-page:disabled').should('have.value', 64);

    cy.wait('@getPokemonsOfPage1').then((data) => {
      const pokemons = data.response.body.results;
      verifyNameOfPokemons(pokemons);
      cy.get('.card-pokemon').should('have.length', 20);
    });
  });

  it('Ejecute click in pokemon and verify the information', () => {
    const pokemonData = {
      name: '',
      types: [],
      imgUrl: '',
      height: '',
      weight: '',
      abilities: [],
      stats: [],
      eggGroups: [],
      habitat: '',
    };

    cy.intercept('https://pokeapi.co/api/v2/pokemon/6', { fixture: 'charizard.json' }).as('getCharizard');
    cy.intercept('https://pokeapi.co/api/v2/pokemon-species/6', { fixture: 'charizard.json' }).as('getInfoOfSpecie');

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

    cy.wait('@getInfoOfSpecie').then((data) => {
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
        .should('have.text', `${pokemonData.height}0 cm`);

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

  describe('Verify pages', () => {
    it('Verify next page', () => {
      cy.intercept('https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20', { fixture: 'list-page-2.json' })
        .as('getPokemonsOfPage2');

      cy.get('.number-page:disabled').should('have.value', 64);

      cy.get('.link-navigation-next').click();
      cy.get('.number-page:enabled').should('have.value', 2);

      cy.wait('@getPokemonsOfPage2').then((data) => {
        const pokemons = data.response.body.results;
        verifyNameOfPokemons(pokemons);
        cy.get('.card-pokemon').should('have.length', 20);
      });
    });

    it('Verify previous page', () => {
      cy.intercept('https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20', { fixture: 'list-page-1.json' })
        .as('getPokemonsOfPage1');

      cy.get('.number-page:disabled').should('have.value', 64);

      cy.get('.link-navigation-back').click();
      cy.get('.number-page:enabled').should('have.value', 1);

      cy.wait('@getPokemonsOfPage1').then((data) => {
        const pokemons = data.response.body.results;
        verifyNameOfPokemons(pokemons);
        cy.get('.card-pokemon').should('have.length', 20);
      });
    });

    it('Verify other page', () => {
      cy.intercept('https://pokeapi.co/api/v2/pokemon/?offset=100&limit=20', { fixture: 'list-page-5.json' })
        .as('getPokemonsOfPage5');

      cy.get('.number-page:enabled').clear();
      cy.get('.number-page:enabled').type('5');
      cy.get('.number-page:enabled').should('have.value', 5);

      cy.get('.number-page:disabled').should('have.value', 64);

      cy.get('.link-navigation-next').click();

      cy.wait('@getPokemonsOfPage5').then((data) => {
        const pokemons = data.response.body.results;
        verifyNameOfPokemons(pokemons);
        cy.get('.card-pokemon').should('have.length', 20);
      });
    });
  });
});
