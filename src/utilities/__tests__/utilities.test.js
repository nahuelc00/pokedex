/* eslint-disable import/extensions */
/// <reference types="Jest" />

import {
  calculateTotalStat, convertHectogramToKilogram,
  capitalizeFirstLetter,
} from '../utilities.js';

test('Calculate total stats', () => {
  const stats = [
    {
      base_stat: 78,
    },
    {
      base_stat: 84,
    },
  ];
  const totalStat = calculateTotalStat(stats);
  expect(totalStat).toBe(162);
});

test('Capitalize first letter of word', () => {
  const namePokemon = capitalizeFirstLetter('charizard');
  expect(namePokemon).toBe('Charizard');
});

test('Convert 500000 hectogram to kilogram', () => {
  const hectogram = 500000;
  const hectogramToKg = convertHectogramToKilogram(hectogram);
  expect(hectogramToKg).toBe('50000.0');
});

test('Convert 50000 hectogram to kilogram', () => {
  const hectogram = 50000;
  const hectogramToKg = convertHectogramToKilogram(hectogram);
  expect(hectogramToKg).toBe('5000.0');
});

test('Convert 5000 hectogram to kilogram', () => {
  const hectogram = 5000;
  const hectogramToKg = convertHectogramToKilogram(hectogram);
  expect(hectogramToKg).toBe('500.0');
});

test('Convert 500 hectogram to kilogram', () => {
  const hectogram = 500;
  const hectogramToKg = convertHectogramToKilogram(hectogram);
  expect(hectogramToKg).toBe('50.0');
});

test('Convert 50 hectogram to kilogram', () => {
  const hectogram = 50;
  const hectogramToKg = convertHectogramToKilogram(hectogram);
  expect(hectogramToKg).toBe('5.0');
});

test('Convert 5 hectogram to kilogram', () => {
  const hectogram = 5;
  const hectogramToKg = convertHectogramToKilogram(hectogram);
  expect(hectogramToKg).toBe('0.5');
});
