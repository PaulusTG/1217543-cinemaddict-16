import AbstractView from './abstract-view.js';

const createBoardContainer = () => (
  `<section class="films">
  </section>`
);

export default class BoardView extends AbstractView {
  get template() {
    return createBoardContainer();
  }
}
