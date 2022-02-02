import dayjs from 'dayjs';
import Duration from 'dayjs/plugin/duration';

dayjs.extend(Duration);

const getRandomNumber = (min = 0, max = 1) => {
  min = Math.ceil(Math.min(min, max));
  max = Math.floor(Math.max(min, max));

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomFloat = (min = 0, max = 1, numAfterPoint = 1) => {
  min = Math.min(Math.abs(min), Math.abs(max));
  max = Math.max(Math.abs(min), Math.abs(max));

  return Number(((Math.random() * (max - min)) + min).toFixed(numAfterPoint));
};

const getRandomRangeFromArray = (arrayToRange, numOfElements) => {
  const slicedArray = arrayToRange.slice();
  const arr = [];
  for (let i = 1; i <= numOfElements; i++) {
    arr.push(slicedArray[getRandomNumber(0, slicedArray.length - 1)]);
    slicedArray.splice(slicedArray.indexOf(arr[arr.length - 1]), 1);
  }

  return arr;
};

const isEscapeKey = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const isCtrlPlusEnterKey = (evt) => evt.ctrlKey && evt.key === 'Enter';

const sortFilmByDate = (filmA, filmB) => dayjs(filmB.filmInfo.date).diff(dayjs(filmA.filmInfo.date));

const sortFilmByRating = (filmA, filmB) => filmB.filmInfo.rating - filmA.filmInfo.rating;

const sortFilmByDefault = (filmA, filmB) => filmB.id - filmA.id;

const getDurationByMinutes = (duration) => dayjs.duration(duration, 'm');

export { getRandomNumber, getRandomFloat, getRandomRangeFromArray, isEscapeKey, isCtrlPlusEnterKey, sortFilmByDate, sortFilmByRating, sortFilmByDefault, getDurationByMinutes };
