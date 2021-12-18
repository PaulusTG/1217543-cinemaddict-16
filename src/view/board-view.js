import { AbstractView } from './abstract-view.js';

const createBoardContainer = () => (
  `<section class="films">
  </section>`
);

class BoardView extends AbstractView {
  get template() {
    return createBoardContainer();
  }
}

export { BoardView };
