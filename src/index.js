/* eslint-disable import/extensions */
import { getAndRenderDataPokemons, rotatePokeballs, listenNavigationOfPage } from './ui.js';

function initialize() {
  rotatePokeballs();
  getAndRenderDataPokemons();
  listenNavigationOfPage();
}

function main() {
  initialize();
}
main();
