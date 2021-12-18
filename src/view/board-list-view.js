import { AbstractView } from './abstract-view.js';

const createBoardListContainer = () => (
  `<section class="films-list">
    <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

  </section>`
);

class BoardListView extends AbstractView {
  get template() {
    return createBoardListContainer();
  }
}

export { BoardListView };
