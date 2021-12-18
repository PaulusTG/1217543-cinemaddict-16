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
import { render, RenderPosition, remove } from './utils/render.js';
import { isEscapeKey } from './utils/common.js';

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
    render(filmListElement, filmPopupComponent, RenderPosition.BEFOREEND);
    bodyElement.classList.add('hide-overflow');
  };

  const closePopupToFilm = () => {
    remove(filmPopupComponent);
    bodyElement.classList.remove('hide-overflow');
  };

  const onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      closePopupToFilm();
      document.removeEventListener('keydown', onEscKeyDown);
    }
  };

  filmComponent.setOnFilmClick(() => {
    openPopupToFilm();
    document.addEventListener('keydown', onEscKeyDown);
  });

  filmPopupComponent.setOnClosePopupClick(() => {
    closePopupToFilm();
    document.removeEventListener('keydown', onEscKeyDown);
  });

  render(filmListElement, filmComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardContainer, boardFilms) => {
  if (boardFilms.length === 0) {
    render(boardContainer, boardComponent, RenderPosition.BEFOREEND);
    render(boardComponent, noFilmComponent, RenderPosition.BEFOREEND);
    return;
  }

  render(boardContainer, sortComponent, RenderPosition.BEFOREEND);
  render(boardContainer, boardComponent, RenderPosition.BEFOREEND);
  render(boardComponent, boardListComponent, RenderPosition.BEFOREEND);
  render(boardListComponent, filmsListComponent, RenderPosition.BEFOREEND);

  boardFilms
    .slice(0, Math.min(boardFilms.length, FILM_COUNT_PER_STEP))
    .forEach((boardFilm) => renderFilm(filmsListComponent.element, boardFilm));

  if (boardFilms.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();

    render(boardListComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setOnClick(() => {
      boardFilms
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((film) => renderFilm(filmsListComponent.element, film));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= boardFilms.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
  render(boardContainer, statsComponent, RenderPosition.BEFOREEND);
};

render(mainElement, menuComponent, RenderPosition.BEFOREEND);
renderBoard(mainElement, films);
render(headerElement, rankComponent, RenderPosition.BEFOREEND);
render(footerStatistics, footerStatsComponent, RenderPosition.BEFOREEND);
