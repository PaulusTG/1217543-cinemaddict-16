import { createElement } from '../render.js';

const createDescription = (description) => {
  if (description.length > 140) {
    return `${description.slice(0, 139)}...`;
  }
  return description;
};

const createFilmTemplate = (film) => {
  const {
    title,
    rating,
    info,
    poster,
    description,
    comments,
    isAddedToWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const watchlistClassName = isAddedToWatchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = isWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = isFavorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
      <a class="film-card__link">
        <h3 class="film-card__title">${title}</h3>
        <p class="film-card__rating">${rating}</p>
        <p class="film-card__info">
          <span class="film-card__year">${info.date.format('YYYY')}</span>
          <span class="film-card__duration">${info.duration.format('h[h] m[m]')}</span>
          <span class="film-card__genre">${info.genre[0]}</span>
        </p>
        <img src="./images/posters/${poster}" alt="" class="film-card__poster">
        <p class="film-card__description">${createDescription(description)}</p>
        <span class="film-card__comments">${comments.count} comments</span>
      </a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${watchlistClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
    </article>`;
};

class FilmView {
  #element = null;
  #film = null;

  constructor(film) {
    this.#film = film;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmTemplate(this.#film);
  }

  removeElement() {
    this.#element = null;
  }
}

export { FilmView };