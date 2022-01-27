import SmartView from './smart-view.js';

const createFooterStatsTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

export default class FooterStatsView extends SmartView {

  constructor(films) {
    super();
    this._data = films;
  }

  get template() {
    return createFooterStatsTemplate(this._data);
  }
}
