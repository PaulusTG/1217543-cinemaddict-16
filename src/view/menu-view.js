import { AbstractView } from './abstract-view.js';

const filtersText = {
  all: 'All movies',
  watchlist: 'Watchlist',
  history: 'History',
  favorites: 'Favorites',
};

const createMenuItemTemplate = (filter, isActive) => {
  const { name, count } = filter;

  const activeClassName = isActive
    ? 'main-navigation__item--active'
    : '';

  const countSpan = name !== 'all'
    ? `<span class="main-navigation__item-count">${count}</span>`
    : '';

  return `<a href="#${name}" id=${name} class="main-navigation__item ${activeClassName}">${filtersText[name]} ${countSpan}</a>`;
};

const createMenuTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createMenuItemTemplate(filter, index === 0))
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

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createMenuTemplate(this.#filters);
  }
}

export { MenuView };
