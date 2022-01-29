import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import Duration from 'dayjs/plugin/duration';
import { getDurationByMinutes } from './common.js';

dayjs.extend(isToday);
dayjs.extend(isSameOrAfter);
dayjs.extend(Duration);

const StatsDateRange = {
  'all-time': (films) => films.filter((film) => film.isWatched),
  'today': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isToday()),
  'week': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isSameOrAfter(dayjs().subtract(1, 'w'))),
  'month': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isSameOrAfter(dayjs().subtract(1, 'M'))),
  'year': (films) => films.filter((film) => film.isWatched && dayjs(film.watchingDate).isSameOrAfter(dayjs().subtract(1, 'y'))),
};

const GenreToFilterMap = {
  'Family': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Family')).length,
  'Sci-Fi': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Sci-Fi')).length,
  'Action': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Action')).length,
  'Thriller': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Thriller')).length,
  'Horror': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Horror')).length,
  'Comedy': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Comedy')).length,
  'Drama': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Drama')).length,
  'Adventure': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Adventure')).length,
  'Animation': (films) => films.filter((film) => film.isWatched && film.filmInfo.genre.includes('Animation')).length,
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
  let duration = dayjs.duration(0, 'm');

  films.forEach((film) => {
    if (film.isWatched) {
      duration = duration.add(getDurationByMinutes(film.filmInfo.duration));
    }
  });

  return `<p class="statistic__item-text">${Number(duration.format('D')) > 0
    ? (Number(duration.format('D')) * 24) + Number(duration.format('H'))
    : duration.format('H')}
    <span class="statistic__item-description">h</span> ${duration.format('m')} <span class="statistic__item-description">m</span></p>`;
};

const countWatchedFilms = (films) => films.filter((film) => film.isWatched).length;

export { countWatchedFilms, countTotalDuration, getRank, getSortedGenres, StatsDateRange };
