import AbstractView from './abstract-view.js';
import { MENU_ITEM } from '../utils/const.js';

const createMenuItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  const activeClassName = type === currentFilterType
    ? 'main-navigation__item--active'
    : '';

  const countSpan = type !== 'all'
    ? `<span class="main-navigation__item-count" data-id="${type}" data-menu-item="${MENU_ITEM.FILMS}">${count}</span>`
    : '';

  return `<a href="#${type}" data-id="${type}" data-menu-item="${MENU_ITEM.FILMS}" class="main-navigation__item ${activeClassName}">${name} ${countSpan}</a>`;
};

const createMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMenuItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" data-menu-item="${MENU_ITEM.STATISTICS}" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class MenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

  #filterItems = null;
  #statsItem = null;

  constructor(filters, currentFilterType) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilterType;
  }

  get template() {
    return createMenuTemplate(this.#filters, this.#currentFilter);
  }

  setOnFilterTypeClick = (callback) => {
    this._callback.filterTypeClick = callback;
    this.#filterItems = this.element.querySelectorAll('.main-navigation__item');
    this.#filterItems.forEach((item) => item.addEventListener('click', this.#onFilterTypeClick));
  }

  #onFilterTypeClick = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.dataset.id);

    this.#statsItem.classList.remove('main-navigation__additional--active');
  }

  setOnStatsClick = () => {
    this.#statsItem = this.element.querySelector('.main-navigation__additional');
    this.#statsItem.addEventListener('click', this.#onStatsClick);
  }

  #onStatsClick = (evt) => {
    evt.preventDefault();
    evt.target.classList.add('main-navigation__additional--active');
    this.#filterItems.forEach((item) => item.classList.remove('main-navigation__item--active'));
  }

  setOnMenuItemClick = (callback) => {
    if (callback) {
      this._callback.menuItemClick = callback;
    }
    this.#filterItems.forEach((item) => item.addEventListener('click', this.#onMenuItemClick));
    this.#statsItem.addEventListener('click', this.#onMenuItemClick);
  }

  #onMenuItemClick = (evt) => {
    evt.preventDefault();
    this._callback.menuItemClick(evt.target.dataset.menuItem);
  }
}
