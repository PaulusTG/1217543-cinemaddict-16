import AbstractObservable from '../utils/abstract-observable.js';

export default class FilmsModel extends AbstractObservable {
  #films = [];

  set films(films) {
    this.#films = [...films];
  }

  get films() {
    return this.#films;
  }

  updateFilm = (updateType, update) => {
    const index = this.#films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this.#films = [
      ...this.#films.slice(0, index),
      update,
      ...this.#films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  deleteComment = (updateType, update) => {
    const { filmId, commentId } = update;

    this.#films.map((film) => {
      if (film.id === filmId) {
        film.comments = film.comments.filter((comment) => comment !== commentId);
      }
    });

    const updatedFilm = this.#films.find((film) => film.id === filmId);

    this._notify(updateType, updatedFilm);
  }

  addComment = (updateType, update) => {
    const { filmId, newComment } = update;
    const { id } = newComment;

    this.#films.map((film) => {
      if (film.id === filmId) {
        film.comments.push(id);
      }
    });

    const updatedFilm = this.#films.find((film) => film.id === filmId);

    this._notify(updateType, updatedFilm);
  }
}
