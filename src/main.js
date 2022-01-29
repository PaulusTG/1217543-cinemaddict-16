import StatsView from './view/stats-view.js';
import FooterStatsView from './view/footer-stats-view.js';
import RankView from './view/rank-view.js';
import { remove, render, RenderPosition } from './utils/render.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import FilmsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import { MENU_ITEM } from './utils/const.js';
import ApiService from './api-service.js';
import { AUTHORIZATION, END_POINT } from './utils/const.js';

const filmsModel = new FilmsModel(new ApiService(END_POINT, AUTHORIZATION));

const filterModel = new FilterModel();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

let statsComponent = null;
let rankComponent = null;

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


filmsModel.init().finally(() => {
  filterPresenter.init(onMenuClick);

  rankComponent = new RankView(filmsModel.films);
  const footerStatsComponent = new FooterStatsView(filmsModel.films);

  render(headerElement, rankComponent, RenderPosition.BEFOREEND);
  render(footerStatistics, footerStatsComponent, RenderPosition.BEFOREEND);
});
boardPresenter.init();
