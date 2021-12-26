import { BoardView } from '../view/board-view.js';
import { BoardListView } from '../view/board-list-view.js';
import { SortView } from '../view/sort-view.js';
import { FilmListView } from '../view/film-list-view.js';
import { NoFilmView } from '../view/no-film-view.js';
import { ShowMoreButtonView } from '../view/btn-show-more-view';
import { FilmPresenter } from './film-presenter.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { updateItem } from '../utils/common.js';

const FILM_COUNT_PER_STEP = 5;

class BoardPresenter {
  #boardContainer = null;

  #boardComponent = new BoardView();
  #boardListComponent = new BoardListView();
  #sortComponent = new SortView();
  #noFilmComponent = new NoFilmView();
  #filmsListComponent = new FilmListView();
  #showMoreButtonComponent = new ShowMoreButtonView();

  #boardFilms = [];
  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenter = new Map();

  constructor(boardContainer) {
    this.#boardContainer = boardContainer;
  }

  init = (boardFilms) => {
    this.#boardFilms = [...boardFilms];

    this.#renderBoard();
  }

  #onModeChange = () => {
    this.#filmPresenter.forEach((presenter) => presenter.resetView());
  }

  #onFilmChange = (updatedFilm) => {
    this.#boardFilms = updateItem(this.#boardFilms, updatedFilm);
    this.#filmPresenter.get(updatedFilm.id).init(updatedFilm);
  }

  #renderSort = () => {
    render(this.#boardContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderBoardList = () => {
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#boardListComponent, RenderPosition.BEFOREEND);
  }

  #renderFilmsList = () => {
    render(this.#boardListComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(0, Math.min(this.#boardFilms.length, FILM_COUNT_PER_STEP));

    if (this.#boardFilms.length > FILM_COUNT_PER_STEP) {
      this.#renderShowMoreButton();
    }
  }

  #renderFilm = (film) => {
    const filmPresenter = new FilmPresenter(this.#filmsListComponent, this.#onFilmChange, this.#onModeChange);
    filmPresenter.init(film);
    this.#filmPresenter.set(film.id, filmPresenter);
  }

  #renderFilms = (from, to) => {
    this.#boardFilms
      .slice(from, to)
      .forEach((boardFilm) => this.#renderFilm(boardFilm));
  }

  #renderNoFilms = () => {
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #clearFilmList = () => {
    this.#filmPresenter.forEach((presenter) => presenter.destroy());
    this.#filmPresenter.clear();
    this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    remove(this.#showMoreButtonComponent);
  }

  #onShowMoreButtonClick = () => {
    this.#renderFilms(this.#renderedFilmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    this.#renderedFilmCount += FILM_COUNT_PER_STEP;

    if (this.#renderedFilmCount >= this.#boardFilms.length) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    render(this.#boardListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);

    this.#showMoreButtonComponent.setOnClick(this.#onShowMoreButtonClick);
  }

  #renderBoard = () => {
    if (this.#boardFilms.length === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    this.#renderBoardList();

    this.#renderFilmsList();
  }
}

export { BoardPresenter };
