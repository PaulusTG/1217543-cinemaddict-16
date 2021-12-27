import { FilmView } from '../view/film-view.js';
import { PopupView } from '../view/popup-view.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
import { isEscapeKey } from '../utils/common.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
};

const bodyElement = document.querySelector('body');

class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;
  #resetMode = null;

  #filmComponent = null;
  #filmPopupComponent = null;

  #film = null;
  #mode = Mode.DEFAULT;

  constructor(filmListContainer, changeData, resetMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#resetMode = resetMode;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;
    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmComponent = new FilmView(film);
    this.#filmPopupComponent = new PopupView(film);

    this.#filmComponent.setOnFilmClick(this.#onFilmClick);
    this.#filmComponent.setOnAddToWatchlistClick(this.#onAddToWatchlistClick);
    this.#filmComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmComponent.setOnFavoriteClick(this.#onFavoriteClick);

    this.#filmPopupComponent.setOnClosePopupClick(this.#onClosePopupClick);
    this.#filmPopupComponent.setOnAddToWatchlistClick(this.#onAddToWatchlistClick);
    this.#filmPopupComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmPopupComponent.setOnFavoriteClick(this.#onFavoriteClick);

    if (prevFilmComponent === null || prevFilmPopupComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#filmComponent, prevFilmComponent);
      return;
    }

    if (this.#mode === Mode.POPUP) {
      replace(this.#filmComponent, prevFilmComponent);
      replace(this.#filmPopupComponent, prevFilmPopupComponent);
      return;
    }

    remove(prevFilmComponent);
    remove(prevFilmPopupComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
    remove(this.#filmPopupComponent);
  }

  resetView = () => {
    if (this.#mode !== Mode.DEFAULT) {
      this.#closePopupToFilm();
    }
  }

  #openPopupToFilm = () => {
    this.#resetMode();
    render(this.#filmListContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
    bodyElement.classList.add('hide-overflow');
    this.#mode = Mode.POPUP;
  };

  #closePopupToFilm = () => {
    this.#filmPopupComponent.element.remove();
    bodyElement.classList.remove('hide-overflow');
    this.#mode = Mode.DEFAULT;
    this.#resetMode();
  };

  #onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.#closePopupToFilm();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onFilmClick = () => {
    this.#openPopupToFilm();
    document.addEventListener('keydown', this.#onEscKeyDown);
  }

  #onClosePopupClick = (film) => {
    this.#changeData(film);
    this.#closePopupToFilm();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onAddToWatchlistClick = () => {
    this.#changeData({ ...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist });
  }

  #onWatchedClick = () => {
    this.#changeData({ ...this.#film, isWatched: !this.#film.isWatched });
  }

  #onFavoriteClick = () => {
    this.#changeData({ ...this.#film, isFavorite: !this.#film.isFavorite });
  }
}

export { FilmPresenter };
