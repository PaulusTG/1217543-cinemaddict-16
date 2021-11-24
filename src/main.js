import { createMenuTemplate } from './view/menu.js';
import { createRankTemplate } from './view/rank.js';
import { createCardContainer, createCardTemplate } from './view/card.js';
import { createBtnShowMoreTemplate } from './view/btn-show-more.js';
import { createPopupTemplate } from './view/popup.js';
import { createStatsTemplate, createFooterStatsTemplate } from './view/stats.js';

const CARD_COUNT = 5;

const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const renderTemplate = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

renderTemplate(headerElement, createRankTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createMenuTemplate(), RenderPosition.AFTERBEGIN);
renderTemplate(mainElement, createStatsTemplate(), RenderPosition.BEFOREEND);

renderTemplate(mainElement, createCardContainer(), RenderPosition.BEFOREEND);

const cardContainer = mainElement.querySelector('.films-list__container');

for (let i = 0; i < CARD_COUNT; i++) {
  renderTemplate(cardContainer, createCardTemplate(), RenderPosition.BEFOREEND);
}

renderTemplate(mainElement, createBtnShowMoreTemplate(), RenderPosition.BEFOREEND);
renderTemplate(mainElement, createPopupTemplate(), RenderPosition.BEFOREEND);
renderTemplate(footerStatistics, createFooterStatsTemplate(), RenderPosition.BEFOREEND);
