import { SmartView } from './smart-view.js';

const DEFAULT_FILM = {
  title: '',
  rating: '0.0',
  info: {
    date: null,
    duration: null,
    genre: '',
    director: '',
    writers: '',
    actors: '',
    country: '',
  },
  poster: '',
  description: '',
  comments: [],
  isAddedToWatchlist: false,
  isWatched: false,
  isFavorite: false,
};

const createPopupTemplate = (film) => {
  const {
    title,
    rating,
    info,
    poster,
    description,
    isAddedToWatchlist,
    isWatched,
    isFavorite,
  } = film;

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
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">18+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${title}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${rating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${info.director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${info.writers}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${info.actors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${info.date.format('D MMMM YYYY')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${info.duration.format('h[h] m[m]')}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${info.country}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">
                  <span class="film-details__genre">${info.genre[0]}</span>
                  <span class="film-details__genre">${info.genre[1]}</span>
                  <span class="film-details__genre">${info.genre[2]}</span></td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
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

class PopupView extends SmartView {

  constructor(film = DEFAULT_FILM) {
    super();
    this._data = PopupView.parseFilmToData(film);
  }

  get template() {
    return createPopupTemplate(this._data);
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

export { PopupView };
