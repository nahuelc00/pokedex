/* eslint-disable import/extensions */
import {
  getAndRenderPokemons, listenNavigationOfPage, renderPagination,
} from './ui.js';

async function initialize() {
  await getAndRenderPokemons();
  await renderPagination();
  listenNavigationOfPage();
}

function main() {
  initialize();
}
main();
