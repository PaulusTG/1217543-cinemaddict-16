import dayjs from 'dayjs';
// import { nanoid } from 'nanoid';
import { getRandomNumber } from '../utils/common.js';
import { EMOJIES } from '../utils/const.js';

const generateEmoji = () => {
  const randomIndex = getRandomNumber(0, EMOJIES.length - 1);

  return EMOJIES[randomIndex];
};

const generateCommentText = () => {
  const texts = ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?', 'WOW! It`s cool!'];
  const randomIndex = getRandomNumber(0, texts.length - 1);

  return texts[randomIndex];
};

const generateCommentAuthor = () => {
  const authors = ['Tim Macoveev', 'John Doe', 'Peter Fisk', 'Emma Kim', 'Gary Stopman', 'Anna Musk', 'Lisa Dover'];

  const randomIndex = getRandomNumber(0, authors.length - 1);

  return authors[randomIndex];
};

const generateCommentDatetime = () => {
  const datetime = dayjs().month(getRandomNumber(0, 11)).date(getRandomNumber(1, 31)).year(getRandomNumber(2005, 2021))
    .hour(getRandomNumber(0, 23)).minute(getRandomNumber(0, 59)).format('YYYY/M/D H:m');

  return datetime;
};

const generateFilmComment = (id) => {
  // const id = nanoid();
  const emoji = generateEmoji();
  const text = generateCommentText();
  const author = generateCommentAuthor();
  const datetime = generateCommentDatetime();

  return {
    id,
    emoji,
    text,
    author,
    datetime,
  };
};

export { generateFilmComment };
