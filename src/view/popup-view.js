import { SmartView } from './smart-view.js';
import { EMOJIES } from '../mock/film.js';

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
  comments: {
    count: 0,
    emoji: '',
    text: '',
    author: '',
    datetime: '',
  },
  isAddedToWatchlist: false,
  isWatched: false,
  isFavorite: false,
};

const createCommentTemplate = (emoji, text, author, datetime) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${datetime}</span>
        <button class="film-details__comment-delete">Delete</button>
      </p>
    </div>
  </li>`);

const createComments = (film) => {
  const { comments } = film;
  const commentsList = [];

  for (let i = 0; i < comments.count; i++) {
    commentsList.push(createCommentTemplate(comments.emoji[i], comments.text[i], comments.author[i], comments.datetime[i]));
  }

  return commentsList;
};

const createEmojiListTemplate = () => (
  EMOJIES.map((emoji) => `
  <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji}" value="${emoji}">
  <label class="film-details__emoji-label" for="emoji-${emoji}">
    <img src="./images/emoji/${emoji}.png" width="30" height="30" alt="emoji">
  </label>`).join('')
);

const createPopupTemplate = (film) => {
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
    isEmojiChoosen,
    newCommentEmoji,
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

  const commentsList = createComments(film).join('');
  const emojiList = createEmojiListTemplate();

  const choosenEmoji = isEmojiChoosen
    ? `<img src="./images/emoji/${newCommentEmoji}.png" width="70" height="70" alt="emoji">`
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
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.count}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsList}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${choosenEmoji}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
            </label>

            <div class="film-details__emoji-list">
              ${emojiList}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

class PopupView extends SmartView {

  #emojiItems = null;
  #scrollPosY = 0;

  constructor(film = DEFAULT_FILM) {
    super();
    this._data = PopupView.parseFilmToData(film);

    this.#setInnerHandlers();
  }

  get template() {
    return createPopupTemplate(this._data);
  }

  restoreHandlers = () => {
    this.#setInnerHandlers();
    this.setOnClosePopupClick();
    this.setOnAddToWatchlistClick();
    this.setOnFavoriteClick();
    this.setOnWatchedClick();
    this.setOnEnterKeydown();
  }

  reset = (film) => {
    this.updateData(
      PopupView.parseFilmToData(film),
    );
  }

  #setInnerHandlers = () => {
    this.#emojiItems = this.element.querySelectorAll('.film-details__emoji-item');
    this.#emojiItems
      .forEach((item) => item.addEventListener('click', this.#onChooseEmoji));
    this.element.querySelector('.film-details__comment-input')
      .addEventListener('input', this.#onNewCommentInput);
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

  setOnEnterKeydown = (callback) => {
    if (callback) {
      this._callback.enterKeydown = callback;
    }
    document.addEventListener('keydown', this.#onEnterKeydown);
  }

  #onNewCommentInput = (evt) => {
    evt.preventDefault();
    this.updateData({
      //text: evt.target.value,
    }, true);
  }

  #onEnterKeydown = (evt) => {
    evt.preventDefault();
    this._callback.enterKeydown(this.parseDataToFilm(this._data));
  }

  #onChooseEmoji = (evt) => {
    evt.preventDefault();
    this.#scrollPosY = this.element.scrollTop;

    this.updateData({
      isEmojiChoosen: evt.target.checked,
      newCommentEmoji: evt.target.value,
    });

    this.#emojiItems.forEach((item) => {
      if (item.value === evt.target.value) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });

    this.element.scrollTo(0, this.#scrollPosY);
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
