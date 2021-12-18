import { AbstractView } from './abstract-view.js';

const createFilmsListContainer = () => (
  `<div class="films-list__container">
  </div>`
);

class FilmListView extends AbstractView {
  get template() {
    return createFilmsListContainer();
  }
}

export { FilmListView };
