/* eslint-disable import/extensions */
import { getAndRenderPokemons, rotatePokeballs, listenNavigationOfPage } from './ui.js';

function initialize() {
  rotatePokeballs();
  getAndRenderPokemons();
  listenNavigationOfPage();
}

function main() {
  initialize();
}
main();
