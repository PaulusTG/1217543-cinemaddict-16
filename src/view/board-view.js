import { createElement } from '../render.js';

const createBoardContainer = () => (
  `<section class="films">
  </section>`
);

class BoardView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBoardContainer();
  }

  removeElement() {
    this.#element = null;
  }
}

export { BoardView };
