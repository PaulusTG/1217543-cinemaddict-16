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

export { getRandomNumber, getRandomFloat, getRandomRangeFromArray };
