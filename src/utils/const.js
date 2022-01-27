const FILTERS_TYPE = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVORITES: 'favorites',
};

const SORT_TYPE = {
  DEFAULT: 'default',
  BY_DATE: 'date',
  BY_RATING: 'rating',
};

const EMOJIES = ['smile', 'sleeping', 'puke', 'angry'];

const USER_ACTION = {
  UPDATE_FILM: 'UPDATE_FILM',
  DELETE_COMMENT: 'DELETE_COMMENT',
  ADD_COMMENT: 'ADD_COMMENT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const MENU_ITEM = {
  FILMS: 'FILMS',
  STATISTICS: 'STATISTICS',
};

export { FILTERS_TYPE, SORT_TYPE, EMOJIES, USER_ACTION, UPDATE_TYPE, MENU_ITEM };
