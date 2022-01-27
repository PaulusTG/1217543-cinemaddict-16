import SmartView from './smart-view.js';
import { countWatchedFilms, getRank } from '../utils/statistics.js';

const createRankTemplate = (films) => {
  const watchedFilms = countWatchedFilms(films);

  const rankElement = watchedFilms !== 0
    ? `<p class="profile__rating">${getRank(watchedFilms)}</p>`
    : '';

  return `<section class="header__profile profile">
    ${rankElement}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class RankView extends SmartView {

  constructor(films) {
    super();
    this._data = films;
  }

  get template() {
    return createRankTemplate(this._data);
  }
}
