/* eslint-disable import/extensions */
/// <reference types="Jest" />

import { checkPokemonHasSpecie } from './validations';

test('Check if the pokemon has specie', () => {
  const hasSpecie = checkPokemonHasSpecie(1010);
  expect(hasSpecie).toBe(true);
});

test('Check if the pokemon has not specie', () => {
  const hasSpecie = checkPokemonHasSpecie(10001);
  expect(hasSpecie).toBe(false);
});
