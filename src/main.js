import { StatsView, FooterStatsView, RankView } from './view/stats-view.js';
import { generateFilmCard } from './mock/film.js';
import { render, RenderPosition } from './utils/render.js';
import { BoardPresenter } from './presenter/board-presenter.js';
import { FilterPresenter } from './presenter/filter-presenter.js';
import { FilmsModel } from './model/films-model.js';
import { FilterModel } from './model/filter-model.js';

const FILM_COUNT = 21;

const films = Array.from({ length: FILM_COUNT }, generateFilmCard);

const filmsModel = new FilmsModel();
filmsModel.films = films;

const filterModel = new FilterModel();

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const statsComponent = new StatsView(films);
const rankComponent = new RankView(films);
const footerStatsComponent = new FooterStatsView(films);

const boardPresenter = new BoardPresenter(mainElement, filmsModel, filterModel);
const filterPresenter = new FilterPresenter(mainElement, filterModel, filmsModel);

filterPresenter.init();
boardPresenter.init();
render(mainElement, statsComponent, RenderPosition.BEFOREEND);
render(headerElement, rankComponent, RenderPosition.BEFOREEND);
render(footerStatistics, footerStatsComponent, RenderPosition.BEFOREEND);
