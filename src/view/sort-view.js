import { AbstractView } from './abstract-view.js';
import { SORT_TYPE } from '../utils/const.js';

const createSortTemplate = () => (`<ul class="sort">
    <li><a href="#" class="sort__button sort__button--active" data-sort-type="${SORT_TYPE.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SORT_TYPE.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button" data-sort-type="${SORT_TYPE.BY_RATING}">Sort by rating</a></li>
  </ul>`
);

class SortView extends AbstractView {
  get template() {
    return createSortTemplate();
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

    this.element.querySelectorAll('.sort__button').forEach((sortButton) => {
      if (sortButton.dataset.sortType === evt.target.dataset.sortType) {
        sortButton.classList.add('sort__button--active');
      } else {
        sortButton.classList.remove('sort__button--active');
      }
    });
  }
}

export { SortView };
