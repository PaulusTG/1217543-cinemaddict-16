import { PopupView } from '../view/popup-view.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
import { isEscapeKey } from '../utils/common.js';
import { USER_ACTION, UPDATE_TYPE } from '../utils/const.js';
import { CommentsPresenter } from './comments-presenter.js';
import { generateFilmComment } from '../mock/comment.js';

const bodyElement = document.querySelector('body');

class PopupPresenter {
  #filmListContainer = null;
  #changeData = null;
  #resetMode = null;

  #isOpened = false;

  #filmPopupComponent = null;

  #commentsContainer = null;
  #commentsPresenters = new Map();

  #film = null;
  #comments = null;
  #scrollPosY = 0;

  constructor(filmListContainer, changeData, resetMode) {
    this.#filmListContainer = filmListContainer;
    this.#changeData = changeData;
    this.#resetMode = resetMode;
  }

  isPopupOpened = () => this.#isOpened;

  getComments = (comments) => comments.map((id) => generateFilmComment(id));

  init = (film) => {
    this.#resetMode();
    this.#film = film;
    this.#comments = this.getComments(film.comments);

    this.#isOpened = true;
    bodyElement.classList.add('hide-overflow');

    const prevFilmPopupComponent = this.#filmPopupComponent;

    this.#filmPopupComponent = new PopupView(film);

    this.#filmPopupComponent.setOnClosePopupClick(this.#onClosePopupClick);
    this.#filmPopupComponent.setOnAddToWatchlistClick(this.#onAddToWatchlistClick);
    this.#filmPopupComponent.setOnWatchedClick(this.#onWatchedClick);
    this.#filmPopupComponent.setOnFavoriteClick(this.#onFavoriteClick);
    this.#filmPopupComponent.setOnPopupScroll(this.#onScroll);
    document.addEventListener('keydown', this.#onEscKeyDown);

    if (prevFilmPopupComponent === null) {
      render(this.#filmListContainer, this.#filmPopupComponent, RenderPosition.BEFOREEND);
      this.renderComments(film, this.#comments);
      this.returnScroll();
      return;
    }

    replace(this.#filmPopupComponent, prevFilmPopupComponent);
    this.renderComments(film, this.#comments);
    this.returnScroll();

    remove(prevFilmPopupComponent);
  }

  destroy = () => {
    this.#isOpened = false;
    remove(this.#filmPopupComponent);
  }

  renderComments = (film, comments) => {
    this.#commentsContainer = this.#filmPopupComponent.element.querySelector('.film-details__bottom-container');
    const commentsPresenter = new CommentsPresenter(this.#commentsContainer, this.#changeData, film.id);

    commentsPresenter.init(comments);
    this.returnScroll();
    this.#commentsPresenters.set(film.id, commentsPresenter);
  }

  closePopupToFilm = () => {
    if (this.#filmPopupComponent) {
      this.#filmPopupComponent.element.remove();
      this.#filmPopupComponent = null;
    }
    bodyElement.classList.remove('hide-overflow');
    this.#isOpened = false;
  };

  returnScroll = () => {
    this.#filmPopupComponent.element.scrollTo(0, this.#scrollPosY);
  }

  #onScroll = () => {
    this.#scrollPosY = this.#filmPopupComponent.element.scrollTop;
  }

  #onEscKeyDown = (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      this.closePopupToFilm();
      document.removeEventListener('keydown', this.#onEscKeyDown);
    }
  };

  #onClosePopupClick = (film) => {
    this.#changeData(film);
    this.closePopupToFilm();
    document.removeEventListener('keydown', this.#onEscKeyDown);
  }

  #onAddToWatchlistClick = () => {
    this.#changeData(
      USER_ACTION.UPDATE_FILM,
      UPDATE_TYPE.MINOR,
      { ...this.#film, isAddedToWatchlist: !this.#film.isAddedToWatchlist });

    this.returnScroll();
  }

  #onWatchedClick = () => {
    this.#changeData(
      USER_ACTION.UPDATE_FILM,
      UPDATE_TYPE.MINOR,
      { ...this.#film, isWatched: !this.#film.isWatched });

    this.returnScroll();
  }

  #onFavoriteClick = () => {
    this.#changeData(
      USER_ACTION.UPDATE_FILM,
      UPDATE_TYPE.MINOR,
      { ...this.#film, isFavorite: !this.#film.isFavorite });

    this.returnScroll();
  }
}

export { PopupPresenter };
