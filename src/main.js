import { createMenuTemplate } from './view/menu.js';
import { createCardContainer, createCardTemplate } from './view/card.js';
import { createBtnShowMoreTemplate } from './view/btn-show-more.js';
import { createPopupTemplate } from './view/popup.js';
import { createStatsTemplate, createFooterStatsTemplate, createRankTemplate } from './view/stats.js';
import { generateFilmCard } from './mock/film.js';
import { generateFilter } from './mock/filter.js';

const CARD_COUNT = 21;
const CARD_COUNT_PER_STEP = 5;

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const films = Array.from({ length: CARD_COUNT }, generateFilmCard);
const filters = generateFilter(films);

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(mainElement, createMenuTemplate(filters), RenderPosition.AFTERBEGIN);

const filmsWatched = document.querySelector('#history span').textContent;
renderTemplate(mainElement, createStatsTemplate(films, filmsWatched), RenderPosition.BEFOREEND);
renderTemplate(headerElement, createRankTemplate(filmsWatched), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createCardContainer(), RenderPosition.BEFOREEND);

const cardContainer = mainElement.querySelector('.films-list__container');

for (let i = 0; i < Math.min(films.length, CARD_COUNT_PER_STEP); i++) {
  renderTemplate(cardContainer, createCardTemplate(films[i]), RenderPosition.BEFOREEND);
}

if (films.length > CARD_COUNT_PER_STEP) {
  let renderedCardCount = CARD_COUNT_PER_STEP;

  renderTemplate(mainElement, createBtnShowMoreTemplate(), RenderPosition.BEFOREEND);

  const showMoreButton = mainElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    films
      .slice(renderedCardCount, renderedCardCount + CARD_COUNT_PER_STEP)
      .forEach((film) => renderTemplate(cardContainer, createCardTemplate(film), RenderPosition.BEFOREEND));

    renderedCardCount += CARD_COUNT_PER_STEP;

    if (renderedCardCount >= films.length) {
      showMoreButton.remove();
    }
  });
}

renderTemplate(mainElement, createPopupTemplate(films[0]), RenderPosition.BEFOREEND);
renderTemplate(footerStatistics, createFooterStatsTemplate(films), RenderPosition.BEFOREEND);
