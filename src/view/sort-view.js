import { AbstractView } from './abstract-view.js';
import { SORT_TYPE } from '../utils/const.js';

const createSortTemplate = (currentSortType) => (`<ul class="sort">
    <li><a href="#" class="sort__button ${currentSortType === SORT_TYPE.DEFAULT ? 'sort__button--active' : ''}" data-sort-type="${SORT_TYPE.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SORT_TYPE.BY_DATE ? 'sort__button--active' : ''}" data-sort-type="${SORT_TYPE.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${currentSortType === SORT_TYPE.BY_RATING ? 'sort__button--active' : ''}" data-sort-type="${SORT_TYPE.BY_RATING}">Sort by rating</a></li>
  </ul>`
);

class SortView extends AbstractView {
  #currentSortType

  constructor(currentSortType) {
    super();
    this.#currentSortType = currentSortType;
  }

  get template() {
    return createSortTemplate(this.#currentSortType);
  }

  setOnSortTypeChange = (callback) => {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener('click', this.#onSortTypeChange);
  }

  #onSortTypeChange = (evt) => {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}

export { SortView };
