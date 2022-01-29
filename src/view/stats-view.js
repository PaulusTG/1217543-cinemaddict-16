import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { countTotalDuration, countWatchedFilms, getRank, getSortedGenres, StatsDateRange } from '../utils/statistics.js';

const renderChart = (chartCtx, films) => {
  const BAR_HEIGHT = 100;
  const genreNames = [];
  const genreCounts = [];
  const sortedGenres = getSortedGenres(films);

  sortedGenres.forEach(({ name, count }) => {
    genreNames.push(name);
    genreCounts.push(count);
  });

  chartCtx.height = BAR_HEIGHT * 5;

  return new Chart(chartCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genreNames,
      datasets: [{
        data: genreCounts,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
        barThickness: 24,
      }],
    },
    options: {
      responsive: false,
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = (films, currentFilter) => {
  const filteredFilms = StatsDateRange[currentFilter](films);

  const sortedGenres = getSortedGenres(filteredFilms);

  const totalDuration = countTotalDuration(filteredFilms);

  const watchedFilms = countWatchedFilms(filteredFilms);

  const rankElement = StatsDateRange['all-time'](films).length !== 0
    ? `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${getRank(StatsDateRange['all-time'](films).length)}</span>
      </p>`
    : '';

  return `<section class="statistic">
    ${rankElement}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${currentFilter === 'all-time' ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today" ${currentFilter === 'today' ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${currentFilter === 'week' ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${currentFilter === 'month' ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${currentFilter === 'year' ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms}<span class="statistic__item-description"> movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${totalDuration}
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${sortedGenres[0].count !== 0 ? sortedGenres[0].name : ''}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class StatsView extends SmartView {
  #chart = null;
  #currentFilter = null;

  constructor(films) {
    super();
    this._data = films;
    this.#currentFilter = 'all-time';

    this.#setChart();
    this.#setOnStatsFilterChange();
  }

  get template() {
    return createStatsTemplate(this._data, this.#currentFilter);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#chart) {
      this.#chart.destroy();
      this.#chart = null;
    }
  }

  restoreHandlers = () => {
    this.#setChart();
    this.#setOnStatsFilterChange();
  }

  #setOnStatsFilterChange = () => {
    this.element.querySelectorAll('.statistic__filters-input')
      .forEach((input) => input.addEventListener('change', this.#onStatsFilterChange));
  }

  #onStatsFilterChange = (evt) => {
    evt.preventDefault();
    this.#currentFilter = evt.target.value;

    this.updateElement();
  }

  #setChart = () => {
    const films = StatsDateRange[this.#currentFilter](this._data);
    const chartCtx = this.element.querySelector('.statistic__chart');

    this.#chart = renderChart(chartCtx, films);
  }
}
