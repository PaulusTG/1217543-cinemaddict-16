import StatsView from './view/stats-view.js';
import FooterStatsView from './view/footer-stats-view.js';
import RankView from './view/rank-view.js';
import { generateFilmCard } from './mock/film.js';
import { remove, render, RenderPosition } from './utils/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import { MENU_ITEM } from './utils/const.js';

const FILM_COUNT = 21;

const films = Array.from({ length: FILM_COUNT }, generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

let statsComponent = null;
let rankComponent = new RankView(filmsModel.films);
const footerStatsComponent = new FooterStatsView(filmsModel.films);

const boardPresenter = new BoardPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

const onMenuClick = (menuItem) => {
  switch (menuItem) {
    case MENU_ITEM.FILMS:
      boardPresenter.init();
      remove(statsComponent);

      remove(rankComponent);
      rankComponent = new RankView(filmsModel.films);
      render(headerElement, rankComponent, RenderPosition.BEFOREEND);
      break;
    case MENU_ITEM.STATISTICS:
      boardPresenter.destroy();
      statsComponent = new StatsView(filmsModel.films);
      render(mainElement, statsComponent, RenderPosition.BEFOREEND);

      remove(rankComponent);
      rankComponent = new RankView(filmsModel.films);
      render(headerElement, rankComponent, RenderPosition.BEFOREEND);
      break;
  }
};

filterPresenter.init(onMenuClick);
boardPresenter.init();

render(headerElement, rankComponent, RenderPosition.BEFOREEND);
render(footerStatistics, footerStatsComponent, RenderPosition.BEFOREEND);
