import { createElement } from '../render.js';

const createBtnShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

class ShowMoreButtonView {
  #element = null;

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createBtnShowMoreTemplate();
  }

  removeElement() {
    this.#element = null;
  }
}

export { ShowMoreButtonView };
