import AbstractObservable from '../utils/abstract-observable.js';
import { FILTERS_TYPE } from '../utils/const.js';

export default class FilterModel extends AbstractObservable {
  #filter = FILTERS_TYPE.ALL;

  get filter() {
    return this.#filter;
  }

  setFilter = (updateType, filter) => {
    this.#filter = filter;
    this._notify(updateType, filter);
  }
}
