import AbstractObservable from '../utils/abstract-observable.js';
import { UPDATE_TYPE } from '../utils/const.js';

export default class FilmsModel extends AbstractObservable {
  #apiService = null;
  #films = [];

  constructor(apiService) {
    super();
    this.#apiService = apiService;
  }

  get films() {
    return this.#films;
  }

  init = async () => {
    try {
      const films = await this.#apiService.films;
      this.#films = films.map(this.#adaptToClient);
    } catch (err) {
      this.#films = [];
    }

    this._notify(UPDATE_TYPE.INIT);
  }

  updateFilm = async (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    try {
      const response = await this.#apiService.updateFilm(update);
      const updatedFilm = this.#adaptToClient(response);
      this.#films = [
        ...this.#films.slice(0, index),
        updatedFilm,
        ...this.#films.slice(index + 1),
      ];
      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t update film');
    }
  }

  deleteComment = async (updateType, update) => {
    const { filmId, commentId } = update;

    try {
      await this.#apiService.deleteComment(commentId);
      const updatedFilm = this.#films.find((film) => film.id === filmId);

      updatedFilm.comments = updatedFilm.comments.filter((comment) => comment !== commentId);

      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t delete comment');
    }
  }

  addComment = async (updateType, update) => {
    const { filmId, newComment } = update;

    try {
      const response = await this.#apiService.addComment(filmId, newComment);
      const updatedFilm = this.#films.find((film) => film.id === filmId);

      updatedFilm.comments = response.comments;

      this._notify(updateType, updatedFilm);
    } catch (err) {
      throw new Error('Can\'t add comment');
    }
  }

  #adaptToClient = (film) => {
    const adaptedFilm = {
      ...film,
      isAddedToWatchlist: film['user_details']['watchlist'],
      isFavorite: film['user_details']['favorite'],
      isWatched: film['user_details']['already_watched'],
      watchingDate: film['user_details']['watching_date'],
      filmInfo: {
        title: film['film_info']['title'],
        alternativeTitle: film['film_info']['alternative_title'],
        rating: film['film_info']['total_rating'],
        ageRating: film['film_info']['age_rating'],
        duration: film['film_info']['runtime'],
        genre: film['film_info']['genre'],
        director: film['film_info']['director'],
        writers: film['film_info']['writers'],
        actors: film['film_info']['actors'],
        poster: film['film_info']['poster'],
        description: film['film_info']['description'],
        date: film['film_info']['release']['date'],
        country: film['film_info']['release']['release_country'],
      },
    };

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }
}
