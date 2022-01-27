import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);

const StatsDateRange = {
  'all-time': (films) => films.filter((film) => film.isWatched),
  'today': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isToday()),
  'week': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isSameOrAfter(dayjs().subtract(1, 'w'))),
  'month': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isSameOrAfter(dayjs().subtract(1, 'M'))),
  'year': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isSameOrAfter(dayjs().subtract(1, 'y'))),
};

const GenreToFilterMap = {
  'Family': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Family')).length,
  'Sci-Fi': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Sci-Fi')).length,
  'Action': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Action')).length,
  'Thriller': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Thriller')).length,
  'Horror': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Horror')).length,
  'Comedy': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Comedy')).length,
  'Drama': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Drama')).length,
  'Adventure': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Adventure')).length,
  'Animation': (films) => films.filter((film) => film.isWatched && film.info.genre.includes('Animation')).length,
};

const getSortedGenres = (films) => Object.entries(GenreToFilterMap).map(
  ([genreName, countFilms]) => ({
    name: genreName,
    count: countFilms(films),
  }),
).sort((a, b) => b.count - a.count);

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

const countTotalDuration = (films) => {
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

const countWatchedFilms = (films) => films.filter((film) => film.isWatched).length;

export { countWatchedFilms, countTotalDuration, getRank, getSortedGenres, StatsDateRange };
