import FilmView from '../view/film-view.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
import { USER_ACTION, UPDATE_TYPE } from '../utils/const.js';

export default class FilmPresenter {
  #filmListContainer = null;
  #changeData = null;

  #filmComponent = null;
  #openPopup = null;

  #film = null;

  constructor(filmListContainer, changeData, openPopup) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#openPopup = openPopup;
  }

  init = (film) => {
    this.#film = film;

    const prevFilmComponent = this.#filmComponent;

    this.#filmComponent = new FilmView(film);

    this.#filmComponent.setOnFilmClick(this.#onFilmClick);
    this.#filmComponent.setOnAddToWatchlistClick(this.#onAddToWatchlistClick);
    this.#filmComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmComponent.setOnFavoriteClick(this.#onFavoriteClick);

    if (prevFilmComponent === null) {
      render(this.#filmListContainer, this.#filmComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filmComponent, prevFilmComponent);

    remove(prevFilmComponent);
  }

  destroy = () => {
    remove(this.#filmComponent);
  }

  #openPopupToFilm = () => {
    this.#openPopup();
  };

  #onFilmClick = () => {
    this.#openPopupToFilm();
  }

  #onAddToWatchlistClick = () => {
    this.#changeData(
      USER_ACTION.UPDATE_FILM,
      UPDATE_TYPE.MINOR,
      { ...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist });
  }

  #onWatchedClick = () => {
    this.#changeData(
      USER_ACTION.UPDATE_FILM,
      UPDATE_TYPE.MINOR,
      { ...this.#film, isWatched: !this.#film.isWatched });
  }

  #onFavoriteClick = () => {
    this.#changeData(
      USER_ACTION.UPDATE_FILM,
      UPDATE_TYPE.MINOR,
      { ...this.#film, isFavorite: !this.#film.isFavorite });
  }
}
