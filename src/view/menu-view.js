import { AbstractView } from './abstract-view.js';

const createMenuItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;

  const activeClassName = type === currentFilterType
    ? 'main-navigation__item--active'
    : '';

  const countSpan = type !== 'all'
    ? `<span class="main-navigation__item-count">${count}</span>`
    : '';

  return `<a href="#${type}" id=${type} class="main-navigation__item ${activeClassName}">${name} ${countSpan}</a>`;
};

const createMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createMenuItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

class MenuView extends AbstractView {
  #filters = null;
  #currentFilter = null;

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
    this.element.addEventListener('click', this.#onFilterTypeClick);
  }

  #onFilterTypeClick = (evt) => {
    evt.preventDefault();
    this._callback.filterTypeClick(evt.target.id);
  }
}

export { MenuView };
