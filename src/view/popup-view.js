import SmartView from './smart-view.js';
import { getDurationByMinutes } from '../utils/common.js';
import dayjs from 'dayjs';

const DEFAULT_FILM = {
  filmInfo: {
    title: '',
    alternativeTitle: '',
    rating: '0.0',
    ageRating: 18,
    date: null,
    duration: null,
    genre: [],
    director: '',
    writers: '',
    actors: '',
    country: '',
    poster: '',
    description: '',
  },
  comments: [],
  isAddedToWatchlist: false,
  isWatched: false,
  isFavorite: false,
};

const createPopupTemplate = (film, isAddingComment) => {
  const {
    filmInfo,
    isAddedToWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const genresList = filmInfo.genre.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');

  const watchlistClassName = isAddedToWatchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = isWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--active'
    : '';

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get" ${isAddingComment ? 'disabled' : ''}>
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

            <p class="film-details__age">${filmInfo.ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${filmInfo.title}</h3>
                <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${filmInfo.rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${filmInfo.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${filmInfo.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${filmInfo.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${dayjs(filmInfo.date).format('D MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getDurationByMinutes(filmInfo.duration).format('H[h] m[m]')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${filmInfo.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  ${genresList}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${filmInfo.description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <button type="button" class="film-details__control-button film-details__control-button--watchlist ${watchlistClassName}" id="watchlist" name="watchlist">Add to watchlist</button>
          <button type="button" class="film-details__control-button film-details__control-button--watched ${watchedClassName}" id="watched" name="watched">Already watched</button>
          <button type="button" class="film-details__control-button film-details__control-button--favorite ${favoriteClassName}" id="favorite" name="favorite">Add to favorites</button>
        </section>
      </div>

      <div class="film-details__bottom-container">
      </div>
    </form>
  </section>`;
};

export default class PopupView extends SmartView {
  #addingComment = false;

  constructor(film = DEFAULT_FILM, addingComment) {
    super();
    this._data = PopupView.parseFilmToData(film);
    this.#addingComment = addingComment;
  }

  get template() {
    return createPopupTemplate(this._data, this.#addingComment);
  }

  restoreHandlers = () => {
    this.setOnClosePopupClick();
    this.setOnAddToWatchlistClick();
    this.setOnFavoriteClick();
    this.setOnWatchedClick();
    this.setOnPopupScroll();
  }

  reset = (film) => {
    this.updateData(
      PopupView.parseFilmToData(film),
    );
  }

  setOnPopupScroll = (callback) => {
    if (callback) {
      this._callback.scrollPopup = callback;
    }
    this.element.addEventListener('scroll', this.#onPopupScroll);
  }

  #onPopupScroll = (evt) => {
    evt.preventDefault();
    this._callback.scrollPopup();
  }

  setOnClosePopupClick = (callback) => {
    if (callback) {
      this._callback.closePopup = callback;
    }
    this.element.querySelector('.film-details__close-btn').addEventListener('click', this.#onClosePopupClick);
  }

  setOnAddToWatchlistClick = (callback) => {
    if (callback) {
      this._callback.addToWatchlistClick = callback;
    }
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#onAddToWatchlistClick);
  }

  setOnWatchedClick = (callback) => {
    if (callback) {
      this._callback.watchedClick = callback;
    }
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#onWatchedClick);
  }

  setOnFavoriteClick = (callback) => {
    if (callback) {
      this._callback.favoriteClick = callback;
    }
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#onFavoriteClick);
  }

  #onClosePopupClick = (evt) => {
    evt.preventDefault();
    this._callback.closePopup(this._data);
  }

  #onAddToWatchlistClick = (evt) => {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  #onWatchedClick = (evt) => {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  #onFavoriteClick = (evt) => {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  static parseFilmToData = (film) => ({
    ...film,
  });

  static parseDataToFilm = (data) => {
    const film = { ...data };

    return film;
  }
}
