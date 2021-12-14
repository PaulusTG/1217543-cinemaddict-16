import { MenuView } from './view/menu-view.js';
import { SortView } from './view/sort-view.js';
import { BoardView } from './view/board-view.js';
import { BoardListView } from './view/board-list-view.js';
import { FilmListView } from './view/film-list-view.js';
import { NoFilmView } from './view/no-film-view.js';
import { FilmView } from './view/film-view.js';
import { ShowMoreButtonView } from './view/btn-show-more-view.js';
import { PopupView } from './view/popup-view.js';
import { StatsView, FooterStatsView, RankView } from './view/stats-view.js';
import { generateFilmCard } from './mock/film.js';
import { generateFilter } from './mock/filter.js';
import { render, RenderPosition } from './render.js';
import { isEscapeKey } from './utils.js';

const FILM_COUNT = 21;
const FILM_COUNT_PER_STEP = 5;

const films = Array.from({ length: FILM_COUNT }, generateFilmCard);
const filters = generateFilter(films);

const mainElement = document.querySelector('.main');
const headerElement = document.querySelector('.header');
const footerStatistics = document.querySelector('.footer__statistics');

const menuComponent = new MenuView(filters);
const sortComponent = new SortView();
const boardComponent = new BoardView();
const boardListComponent = new BoardListView();
const noFilmComponent = new NoFilmView();
const filmsListComponent = new FilmListView();

const filmsWatched = menuComponent.element.querySelector('#history span').textContent;
const statsComponent = new StatsView(films, filmsWatched);
const rankComponent = new RankView(filmsWatched);
const footerStatsComponent = new FooterStatsView(films);

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmView(film);
  const filmPopupComponent = new PopupView(film);
  const bodyElement = document.querySelector('body');

  const openPopupToFilm = () => {
    filmListElement.appendChild(filmPopupComponent.element);
    bodyElement.classList.add('hide-overflow');
  };

  const closePopupToFilm = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
    }
    filmListElement.removeChild(filmPopupComponent.element);
    bodyElement.classList.remove('hide-overflow');
    document.removeEventListener('keydown', closePopupToFilm);
  };

  filmComponent.element.querySelector('.film-card__link').addEventListener('click', () => {
    openPopupToFilm();
    document.addEventListener('keydown', closePopupToFilm);
  });

  filmPopupComponent.element.querySelector('.film-details__close-btn').addEventListener('click', (evt) => {
    evt.preventDefault();
    closePopupToFilm(evt);
  });

  render(filmListElement, filmComponent.element, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardFilms) => {
  if (boardFilms.length === 0) {
    render(boardContainer, boardComponent.element, RenderPosition.BEFOREEND);
    render(boardComponent.element, noFilmComponent.element, RenderPosition.BEFOREEND);
    return;
  }

  render(boardContainer, sortComponent.element, RenderPosition.BEFOREEND);
  render(boardContainer, boardComponent.element, RenderPosition.BEFOREEND);
  render(boardComponent.element, boardListComponent.element, RenderPosition.BEFOREEND);
  render(boardListComponent.element, filmsListComponent.element, RenderPosition.BEFOREEND);

  boardFilms
    .slice(0, Math.min(boardFilms.length, FILM_COUNT_PER_STEP))
    .forEach((boardFilm) => renderFilm(filmsListComponent.element, boardFilm));

  if (boardFilms.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(boardListComponent.element, showMoreButtonComponent.element, RenderPosition.BEFOREEND);

    showMoreButtonComponent.element.addEventListener('click', (evt) => {
      evt.preventDefault();
      boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsListComponent.element, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= boardFilms.length) {
        showMoreButtonComponent.element.remove();
        showMoreButtonComponent.removeElement();
      }
    });
  }
  render(boardContainer, statsComponent.element, RenderPosition.BEFOREEND);
};

render(mainElement, menuComponent.element, RenderPosition.BEFOREEND);
renderBoard(mainElement, films);
render(headerElement, rankComponent.element, RenderPosition.BEFOREEND);
render(footerStatistics, footerStatsComponent.element, RenderPosition.BEFOREEND);
