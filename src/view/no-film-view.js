import AbstractView from './abstract-view.js';
import { FILTERS_TYPE } from '../utils/const.js';

const NoFilmsTextType = {
  [FILTERS_TYPE.ALL]: 'There are no movies in our database',
  [FILTERS_TYPE.WATCHLIST]: 'There are no movies to watch now',
  [FILTERS_TYPE.HISTORY]: 'There are no watched movies now',
  [FILTERS_TYPE.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmTemplate = (filterType) => {
  const noFilmsTextValue = NoFilmsTextType[filterType];

  return `<section class="films-list">
    <h2 class="films-list__title">${noFilmsTextValue}</h2>

  </section>`;
};

export default class NoFilmView extends AbstractView {
  constructor(data) {
    super();
    this._data = data;
  }

  get template() {
    return createNoFilmTemplate(this._data);
  }
}
