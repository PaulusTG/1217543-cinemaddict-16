import { createElement } from '../render.js';

const createBoardListContainer = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

  </section>`
);

class BoardListView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBoardListContainer();
  }

  removeElement() {
    this.#element = null;
  }
}

export { BoardListView };
