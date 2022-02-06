import BoardView from '../view/board-view.js';
import BoardListView from '../view/board-list-view.js';
import SortView from '../view/sort-view.js';
import { SORT_TYPE, USER_ACTION, UPDATE_TYPE, FILTERS_TYPE } from '../utils/const.js';
import FilmListView from '../view/film-list-view.js';
import NoFilmView from '../view/no-film-view.js';
import LoadingView from '../view/loading-view.js';
import TopRatedFilmsView from '../view/top-rated-films-view.js';
import MostCommentedFilmsView from '../view/most-commented-films-view.js';
import ShowMoreButtonView from '../view/btn-show-more-view';
import FilmPresenter from './film-presenter.js';
import PopupPresenter from './popup-presenter.js';
import { render, RenderPosition, remove } from '../utils/render.js';
import { sortFilmByDate, sortFilmByRating, sortFilmByDefault, sortFilmByMostCommented } from '../utils/common.js';
import { filter } from '../utils/filter.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_COUNT_FOR_EXTRA = 2;

export default class BoardPresenter {
  #boardContainer = null;
  #filmsModel = null;
  #filterModel = null;

  #boardComponent = new BoardView();
  #boardListComponent = new BoardListView();
  #filmsListComponent = new FilmListView();
  #loadingComponent = new LoadingView();
  #topRatedFilmsComponent = new TopRatedFilmsView();
  #mostCommentedFilmsComponent = new MostCommentedFilmsView();
  #noFilmComponent = null;
  #sortComponent = null;
  #showMoreButtonComponent = null;

  #renderedFilmCount = FILM_COUNT_PER_STEP;
  #filmPresenters = new Map();
  #popupPresenters = new Map();
  #currentSortType = SORT_TYPE.DEFAULT;
  #filterType = FILTERS_TYPE.ALL;

  #openedPopup = null;
  #isRepeat = false;
  #isLoading = true;

  constructor(boardContainer, filmsModel, filterModel) {
    this.#boardContainer = boardContainer;
    this.#filmsModel = filmsModel;
    this.#filterModel = filterModel;
  }

  get films() {
    this.#filterType = this.#filterModel.filter;
    const films = this.#filmsModel.films;
    const filteredFilms = filter[this.#filterType](films);

    switch (this.#currentSortType) {
      case SORT_TYPE.DEFAULT:
        return filteredFilms.sort(sortFilmByDefault);
      case SORT_TYPE.BY_DATE:
        return filteredFilms.sort(sortFilmByDate);
      case SORT_TYPE.BY_RATING:
        return filteredFilms.sort(sortFilmByRating);
    }

    return filteredFilms;
  }

  get topRatedFilms() {
    const filmsWithRating = this.#filmsModel.films.slice().filter((film) => film.filmInfo.rating > 0);

    if (!filmsWithRating.length) {
      return [];
    }

    return filmsWithRating.sort(sortFilmByRating).slice(0, FILM_COUNT_FOR_EXTRA);
  }

  get mostCommentedFilms() {
    const filmsWithComments = this.#filmsModel.films.slice().filter((film) => film.comments.length > 0);

    if (!filmsWithComments.length) {
      return [];
    }

    return filmsWithComments.sort(sortFilmByMostCommented).slice(0, FILM_COUNT_FOR_EXTRA);
  }

  init = () => {
    if (this.#isRepeat) {
      return;
    }

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);

    this.#renderBoard();
    this.#isRepeat = true;
  }

  destroy = () => {
    this.#clearBoard({ resetRenderedFilmCount: true, resetSortType: true });

    remove(this.#filmsListComponent);
    remove(this.#boardListComponent);
    remove(this.#boardComponent);

    this.#filmsModel.removeObserver(this.#onModelEvent);
    this.#filterModel.removeObserver(this.#onModelEvent);
    this.#isRepeat = false;
  }

  #onModeReset = () => {
    this.#popupPresenters.forEach((presenter) => presenter.closePopupToFilm());
  }

  #onViewAction = async (actionType, updateType, update) => {
    switch (actionType) {
      case USER_ACTION.UPDATE_FILM:
        this.#filmsModel.updateFilm(updateType, update);
        break;
      case USER_ACTION.DELETE_COMMENT:
        try {
          this.#popupPresenters.get(update.filmId).setDeletingComment(update.commentId);
          await this.#filmsModel.deleteComment(updateType, update);
        } catch (err) {
          this.#popupPresenters.get(update.filmId).setAborting();
        }
        break;
      case USER_ACTION.ADD_COMMENT:
        try {
          this.#popupPresenters.get(update.filmId).setAddingComment(true);
          await this.#filmsModel.addComment(updateType, update);
        } catch (err) {
          this.#popupPresenters.get(update.filmId).setAborting();
        }
        break;
    }
  }

  #onModelEvent = (updateType, data) => {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this.#filmPresenters.get(data.id).init(data);
        if (this.#popupPresenters) {
          this.#popupPresenters.get(data.id).init(data);
        }
        break;
      case UPDATE_TYPE.MINOR:
        this.#clearBoard();
        this.#renderBoard();
        break;
      case UPDATE_TYPE.MAJOR:
        this.#clearBoard({ resetRenderedFilmCount: true, resetSortType: true });
        this.#renderBoard();
        break;
      case UPDATE_TYPE.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
    }
  }

  #onSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;

    this.#clearBoard({ resetRenderedFilmCount: true });
    this.#renderBoard();
  }

  #renderSort = () => {
    this.#sortComponent = new SortView(this.#currentSortType);
    this.#sortComponent.setOnSortTypeChange(this.#onSortTypeChange);
    render(this.#boardContainer, this.#sortComponent, RenderPosition.BEFOREEND);
  }

  #renderFilm = (container, film) => {
    const popupPresenter = new PopupPresenter(this.#boardComponent, this.#onViewAction, this.#onModeReset);
    const openPopupPresenter = () => popupPresenter.init(film);
    const filmPresenter = new FilmPresenter(container, this.#onViewAction, openPopupPresenter);
    filmPresenter.init(film);
    this.#filmPresenters.set(film.id, filmPresenter);
    this.#popupPresenters.set(film.id, popupPresenter);
  }

  #renderFilms = (films) => {
    films.forEach((film) => this.#renderFilm(this.#filmsListComponent, film));
  }

  #renderTopRatedFilms = () => {
    if (this.topRatedFilms?.length !== 0) {
      render(this.#boardComponent, this.#topRatedFilmsComponent, RenderPosition.BEFOREEND);
      const topRatedContainer = this.#topRatedFilmsComponent.element.querySelector('.films-list__container');
      this.topRatedFilms.forEach((film) => this.#renderFilm(topRatedContainer, film));
    }
  }

  #renderMostCommentedFilms = () => {
    if (this.mostCommentedFilms?.length !== 0) {
      render(this.#boardComponent, this.#mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
      const mostCommentedContainer = this.#mostCommentedFilmsComponent.element.querySelector('.films-list__container');
      this.mostCommentedFilms.forEach((film) => this.#renderFilm(mostCommentedContainer, film));
    }
  }

  #renderExtra = () => {
    this.#renderTopRatedFilms();
    this.#renderMostCommentedFilms();
  }

  #renderLoading = () => {
    render(this.#boardListComponent, this.#loadingComponent, RenderPosition.BEFOREEND);
  }

  #renderNoFilms = () => {
    this.#noFilmComponent = new NoFilmView(this.#filterType);
    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#noFilmComponent, RenderPosition.BEFOREEND);
  }

  #onShowMoreButtonClick = () => {
    const filmCount = this.films.length;
    const newRenderedFilmCount = Math.min(filmCount, this.#renderedFilmCount + FILM_COUNT_PER_STEP);
    const films = this.films.slice(this.#renderedFilmCount, newRenderedFilmCount);

    this.#renderFilms(films);
    this.#renderedFilmCount = newRenderedFilmCount;

    if (this.#renderedFilmCount >= filmCount) {
      remove(this.#showMoreButtonComponent);
    }
  }

  #renderShowMoreButton = () => {
    this.#showMoreButtonComponent = new ShowMoreButtonView();
    this.#showMoreButtonComponent.setOnClick(this.#onShowMoreButtonClick);

    render(this.#boardListComponent, this.#showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  #clearBoard = ({ resetRenderedFilmCount = false, resetSortType = false } = {}) => {
    const filmCount = this.films.length;
    remove(this.#topRatedFilmsComponent);
    remove(this.#mostCommentedFilmsComponent);
    this.#openedPopup = null;

    this.#popupPresenters.forEach((presenter, filmId) => {
      if (presenter.isPopupOpened()) {
        this.#openedPopup = [presenter, filmId];
        presenter.closePopupToFilm();
      }
    });

    this.#filmPresenters.forEach((presenter) => presenter.destroy());
    this.#filmPresenters.clear();
    this.#popupPresenters.forEach((presenter) => presenter.destroy());
    this.#popupPresenters.clear();

    remove(this.#sortComponent);
    remove(this.#loadingComponent);
    remove(this.#showMoreButtonComponent);

    if (this.#noFilmComponent) {
      remove(this.#noFilmComponent);
    }

    if (resetRenderedFilmCount) {
      this.#renderedFilmCount = FILM_COUNT_PER_STEP;
    } else {
      this.#renderedFilmCount = Math.min(filmCount, this.#renderedFilmCount);
    }

    if (resetSortType) {
      this.#currentSortType = SORT_TYPE.DEFAULT;
    }
  }

  #renderBoard = () => {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    const films = this.films;
    const filmCount = films.length;

    if (filmCount === 0) {
      this.#renderNoFilms();
      return;
    }

    this.#renderSort();

    render(this.#boardContainer, this.#boardComponent, RenderPosition.BEFOREEND);
    render(this.#boardComponent, this.#boardListComponent, RenderPosition.BEFOREEND);
    render(this.#boardListComponent, this.#filmsListComponent, RenderPosition.BEFOREEND);

    this.#renderFilms(films.slice(0, Math.min(filmCount, this.#renderedFilmCount)));

    if (this.#openedPopup) {
      const currentFilm = films.find((film) => film.id === this.#openedPopup[1]);
      this.#popupPresenters.set(this.#openedPopup[1], this.#openedPopup[0]);
      this.#openedPopup[0].init(currentFilm);
    }

    if (filmCount > this.#renderedFilmCount) {
      this.#renderShowMoreButton();
    }

    this.#renderExtra();
  }
}
