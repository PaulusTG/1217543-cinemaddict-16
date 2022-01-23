import { FILTERS_TYPE } from './const.js';

const filter = {
  [FILTERS_TYPE.ALL]: (films) => films,
  [FILTERS_TYPE.WATCHLIST]: (films) => films.filter((film) => film.isAddedToWatchlist),
  [FILTERS_TYPE.HISTORY]: (films) => films.filter((film) => film.isWatched),
  [FILTERS_TYPE.FAVORITES]: (films) => films.filter((film) => film.isFavorite),
};

export { filter };
