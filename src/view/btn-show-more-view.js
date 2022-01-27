import AbstractView from './abstract-view.js';

const createBtnShowMoreTemplate = () => (
  '<button class="films-list__show-more">Show more</button>'
);

export default class ShowMoreButtonView extends AbstractView {
  get template() {
    return createBtnShowMoreTemplate();
  }

  setOnClick = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#onClick);
  }

  #onClick = (evt) => {
    evt.preventDefault();
    this._callback.click();
  }
}
