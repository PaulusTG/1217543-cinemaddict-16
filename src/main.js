import { MenuView } from './view/menu-view.js';
import { StatsView, FooterStatsView, RankView } from './view/stats-view.js';
import { generateFilmCard } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import { render, RenderPosition } from './utils/render.js';
import { BoardPresenter } from './presenter/board-presenter.js';

const FILM_COUNT = 21;

const films = Array.from({ length: FILM_COUNT }, generateFilmCard);
const filters = generateFilter(films);

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const menuComponent = new MenuView(filters);

const filmsWatched = menuComponent.element.querySelector('#history span').textContent;
const statsComponent = new StatsView(films, filmsWatched);
const rankComponent = new RankView(filmsWatched);
const footerStatsComponent = new FooterStatsView(films);

const boardPresenter = new BoardPresenter(mainElement);

render(mainElement, menuComponent, RenderPosition.BEFOREEND);
boardPresenter.init(films);
render(mainElement, statsComponent, RenderPosition.BEFOREEND);
render(headerElement, rankComponent, RenderPosition.BEFOREEND);
render(footerStatistics, footerStatsComponent, RenderPosition.BEFOREEND);
