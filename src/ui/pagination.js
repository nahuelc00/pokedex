/* eslint-disable import/extensions */
/* global  $ */
import { updateUrlActual, infoUrl } from '../api/pokemon.js';
import { getPokemonsQuantity } from '../services/pokemon.js';

import { getAndRenderPokemons } from './general.js';

function renderPagination() {
  return getPokemonsQuantity().then((quantity) => {
    const $containerItemsPagination = $('.container-pagination');
    $containerItemsPagination.append('<li class="page-item link-navigation-back"><a class="page-link rounded-pill" href="#"><--</a></li>');
    $containerItemsPagination.append(`<li class="page-item text-primary fs-2 ms-3 me-3 d-grid align-content-center"><input class="text-primary border-top-0 border-start-0 border-end-0 number-page text-center" type="text" value="${infoUrl.numberOfPageActual}"></li>`);
    $containerItemsPagination.append(`<li class="page-item text-primary fs-2 ms-3 me-3 d-grid align-content-center"><input disabled class="bg-transparent opacity-75 text-primary border-0 number-page text-center" type="text" value="${Math.floor(quantity / infoUrl.limitOfPokemons)}"></li>`);
    $containerItemsPagination.append('<li class="page-item link-navigation-next"><a class="page-link rounded-pill" href="#">GO</a></li>');
  });
}

function goNextPage() {
  $('.link-navigation-next').on('click', async () => {
    const limitPerPage = infoUrl.limitOfPokemons;
    const quantityPokemons = await getPokemonsQuantity();
    const $numberPage = $('.number-page');
    const totalPages = Math.floor(quantityPokemons / limitPerPage);
    const enteredPage = Number($numberPage.val());

    if (Number.isNaN(enteredPage)) {
      $('.number-page').addClass('border-danger');
      return;
    }
    if (enteredPage < 0) {
      $('.number-page').addClass('border-danger');
      return;
    }
    if (enteredPage === 0) {
      $('.number-page').addClass('border-danger');
      return;
    }

    $('.number-page').removeClass('border-danger');

    if (enteredPage !== infoUrl.numberOfPageActual) {
      if (enteredPage < totalPages || enteredPage === totalPages) {
        infoUrl.numberOfPageActual = Number($('.number-page').val());
        if (infoUrl.numberOfPageActual === 1) {
          infoUrl.numberOfPageActual = 1;
          infoUrl.offset = 0;
          updateUrlActual(infoUrl.offset);
        } else {
          infoUrl.offset = infoUrl.numberOfPageActual * infoUrl.limitOfPokemons;
          updateUrlActual(infoUrl.offset);
        }
      } else {
        $('.number-page').addClass('border-danger');
        return;
      }
    } else if (enteredPage === totalPages) {
      $('.number-page').addClass('border-danger');
      return;
    } else {
      infoUrl.numberOfPageActual += 1;
      infoUrl.offset += 20;
      updateUrlActual(infoUrl.offset);
    }

    $('.container-cards-pokemons').empty();
    $('.container-pagination').empty();
    await getAndRenderPokemons();
    await renderPagination();
    // eslint-disable-next-line no-use-before-define
    listenNavigationOfPage();
  });
}

function goPreviousPage() {
  $('.link-navigation-back').on('click', async () => {
    if (infoUrl.urlActual !== infoUrl.urlInitial) {
      // eslint-disable-next-line no-param-reassign
      // infoUrl.page = 'previous';
      // eslint-disable-next-line no-param-reassign
      infoUrl.numberOfPageActual -= 1;
      infoUrl.offset -= 20;
      updateUrlActual(infoUrl.offset);
      $('.container-cards-pokemons').empty();
      $('.container-pagination').empty();
      await getAndRenderPokemons();
      await renderPagination();
      // eslint-disable-next-line no-use-before-define
      listenNavigationOfPage();
    }
  });
}

function listenNavigationOfPage() {
  goNextPage();
  goPreviousPage();
}

export { listenNavigationOfPage, renderPagination };
