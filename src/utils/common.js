import dayjs from 'dayjs';

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

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};

const sortFilmByDate = (filmA, filmB) => dayjs(filmB.info.date).diff(dayjs(filmA.info.date));

const sortFilmByRating = (filmA, filmB) => filmB.rating - filmA.rating;

export { getRandomNumber, getRandomFloat, getRandomRangeFromArray, isEscapeKey, updateItem, sortFilmByDate, sortFilmByRating };
