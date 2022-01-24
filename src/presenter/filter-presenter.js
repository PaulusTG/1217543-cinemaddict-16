import { MenuView } from '../view/menu-view.js';
import { render, RenderPosition, replace, remove } from '../utils/render.js';
import { filter } from '../utils/filter.js';
import { FILTERS_TYPE, UPDATE_TYPE } from '../utils/const.js';

class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #filmsModel = null;

  #filterComponent = null;

  constructor(filterContainer, filterModel, filmsModel) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#filmsModel = filmsModel;

    this.#filmsModel.addObserver(this.#onModelEvent);
    this.#filterModel.addObserver(this.#onModelEvent);
  }

  get filters() {
    const films = this.#filmsModel.films;

    return [
      {
        type: FILTERS_TYPE.ALL,
        name: 'All movies',
        count: filter[FILTERS_TYPE.ALL](films).length,
      },
      {
        type: FILTERS_TYPE.WATCHLIST,
        name: 'Watchlist',
        count: filter[FILTERS_TYPE.WATCHLIST](films).length,
      },
      {
        type: FILTERS_TYPE.HISTORY,
        name: 'History',
        count: filter[FILTERS_TYPE.HISTORY](films).length,
      },
      {
        type: FILTERS_TYPE.FAVORITES,
        name: 'Favorites',
        count: filter[FILTERS_TYPE.FAVORITES](films).length,
      },
    ];
  }

  init = () => {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new MenuView(filters, this.#filterModel.filter);
    this.#filterComponent.setOnFilterTypeClick(this.#onFilterTypeClick);

    if (prevFilterComponent === null) {
      render(this.#filterContainer, this.#filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #onModelEvent = () => {
    this.init();
  }

  #onFilterTypeClick = (filterType) => {
    if (this.#filterModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  }
}

export { FilterPresenter };
