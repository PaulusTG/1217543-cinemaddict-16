import { createElement } from '../render.js';

const createFilmsListContainer = () => (
  `<div class="films-list__container">
  </div>`
);

class FilmListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFilmsListContainer();
  }

  removeElement() {
    this.#element = null;
  }
}

export { FilmListView };
