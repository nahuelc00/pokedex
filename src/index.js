/* eslint-disable import/extensions */
import {
  getAndRenderPokemons, listenNavigationOfPage, renderPagination,
} from './ui.js';

function initialize() {
  renderPagination();
  listenNavigationOfPage();
  getAndRenderPokemons();
}

function main() {
  initialize();
}
main();
