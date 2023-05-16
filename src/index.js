/* eslint-disable import/extensions */
import { getAndRenderPokemons } from './ui/general.js';
import { renderPagination, listenNavigationOfPage } from './ui/pagination.js';

async function initialize() {
  await getAndRenderPokemons();
  await renderPagination();
  listenNavigationOfPage();
}

function main() {
  initialize();
}
main();
