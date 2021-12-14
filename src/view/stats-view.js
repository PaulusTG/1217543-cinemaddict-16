import { createElement } from '../render.js';

const genreToFilterMap = {
  'Family': (films) => films.filter((film) => film.info.genre.includes('Family')).length,
  'Sci-Fi': (films) => films.filter((film) => film.info.genre.includes('Sci-Fi')).length,
  'Action': (films) => films.filter((film) => film.info.genre.includes('Action')).length,
  'Thriller': (films) => films.filter((film) => film.info.genre.includes('Thriller')).length,
  'Horror': (films) => films.filter((film) => film.info.genre.includes('Horror')).length,
  'Comedy': (films) => films.filter((film) => film.info.genre.includes('Comedy')).length,
  'Drama': (films) => films.filter((film) => film.info.genre.includes('Drama')).length,
  'Adventure': (films) => films.filter((film) => film.info.genre.includes('Adventure')).length,
  'Animation': (films) => films.filter((film) => film.info.genre.includes('Animation')).length,
};

const createFooterStatsTemplate = (films) => (
  `<p>${films.length} movies inside</p>`
);

const getTopGenre = (films) => Object.entries(genreToFilterMap).map(
  ([genreName, countFilms]) => ({
    name: genreName,
    count: countFilms(films),
  }),
);

const getTotalDuration = (films) => {
  let totalHours = 0;
  let totalMinutes = 0;

  films.map((film) => {
    if (film.isWatched) {
      totalHours += Number(film.info.duration.format('h'));
      totalMinutes += Number(film.info.duration.format('m'));
    }
  });
  totalHours += (Math.floor(totalMinutes / 60));
  totalMinutes -= (Math.floor(totalMinutes / 60)) * 60;

  return `<p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span> ${totalMinutes} <span class="statistic__item-description">m</span></p>`;
};

const getRank = (watched) => {
  let rank = '';
  if (Number(watched) >= 1 && Number(watched) <= 10) {
    rank = 'Novice';
  } else if (Number(watched) >= 11 && Number(watched) <= 20) {
    rank = 'Fan';
  } else if (Number(watched) >= 21) {
    rank = 'Movie buff';
  }
  return rank;
};

const createStatsTemplate = (films, watched) => {

  const topGenres = getTopGenre(films).sort((a, b) => b.count - a.count);

  const rankElement = Number(watched) !== 0
    ? `<p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${getRank(watched)}</span>
      </p>`
    : '';

  return `<section class="statistic">
    ${rankElement}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watched} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        ${getTotalDuration(films)}
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenres[0].name}</p>
      </li>
    </ul>

    <!-- Пример диаграммы -->
    <img src="images/cinemaddict-stats-markup.png" alt="Пример диаграммы">

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

const createRankTemplate = (watched) => {
  const rankElement = Number(watched) !== 0
    ? `<p class="profile__rating">${getRank(watched)}</p>`
    : '';

  return `<section class="header__profile profile">
    ${rankElement}
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

class StatsView {
  #element = null;
  #films = null;
  #watched = null;

  constructor(films, watched) {
    this.#films = films;
    this.#watched = watched;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createStatsTemplate(this.#films, this.#watched);
  }

  removeElement() {
    this.#element = null;
  }
}

class FooterStatsView {
  #element = null;
  #films = null;

  constructor(films) {
    this.#films = films;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createFooterStatsTemplate(this.#films);
  }

  removeElement() {
    this.#element = null;
  }
}

class RankView {
  #element = null;
  #watched = null;

  constructor(watched) {
    this.#watched = watched;
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.template);
    }

    return this.#element;
  }

  get template() {
    return createRankTemplate(this.#watched);
  }

  removeElement() {
    this.#element = null;
  }
}

export { StatsView, FooterStatsView, RankView };
