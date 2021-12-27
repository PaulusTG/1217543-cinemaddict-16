import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { getRandomNumber, getRandomFloat, getRandomRangeFromArray } from '../utils/common.js';

const filmPosters = {
  'Made for Each Other': 'made-for-each-other.png',
  'Popeye the Sailor meets Sindbad the Sailor': 'popeye-meets-sinbad.png',
  'Sagebrush trail': 'sagebrush-trail.jpg',
  'Santa Claus conquers the Martians': 'santa-claus-conquers-the-martians.jpg',
  'The Dance of Life': 'the-dance-of-life.jpg',
  'The Great Flamarion': 'the-great-flamarion.jpg',
  'The Man with the Golden Arm': 'the-man-with-the-golden-arm.jpg',
};

const generateTitle = () => {
  const titles = ['Made for Each Other', 'Popeye the Sailor meets Sindbad the Sailor',
    'Sagebrush trail', 'Santa Claus conquers the Martians', 'The Dance of Life',
    'The Great Flamarion', 'The Man with the Golden Arm'];

  const randomIndex = getRandomNumber(0, titles.length - 1);

  return titles[randomIndex];
};

const generateGenre = () => {
  const genres = ['Family', 'Sci-Fi', 'Action', 'Thriller', 'Horror', 'Comedy', 'Drama', 'Adventure', 'Animation'];

  return getRandomRangeFromArray(genres, 3);
};

const generateDirector = () => {
  const directors = ['Anthony Mann', 'Jonathan Favreau', 'Kevin Feige', 'Christopher Nolan', 'James Cameron', 'James Gunn Jr.'];

  const randomIndex = getRandomNumber(0, directors.length - 1);

  return directors[randomIndex];
};

const generateWriter = () => {
  const writers = ['Anne Wigton', 'Heinz Herald', 'Richard Weil', 'Paul Savage', 'Neil Simon', 'Alec Sulkin', 'Peter Sullivan'];

  return getRandomRangeFromArray(writers, 3);
};

const generateActor = () => {
  const actors = ['Erich von Stroheim', 'Mary Beth Hughes', 'Dan Duryea', 'Keira Knightley', 'Johnny Depp', 'Tom Cruise', 'Emily Blunt'];

  return getRandomRangeFromArray(actors, 3);
};

const generateCountry = () => {
  const countries = ['USA', 'Russia', 'German', 'United Kingdom', 'Spain', 'Canada', 'France', 'Ukraine', 'Italy'];

  const randomIndex = getRandomNumber(0, countries.length - 1);

  return countries[randomIndex];
};

const generateEmoji = (count) => {
  const emojies = ['smile', 'sleeping', 'puke', 'angry'];
  const emojiesList = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomNumber(0, emojies.length - 1);
    emojiesList.push(emojies[randomIndex]);
  }

  return emojiesList;
};

const generateCommentText = (count) => {
  const texts = ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?', 'WOW! It`s cool!'];

  return getRandomRangeFromArray(texts, count);
};

const generateCommentAuthor = (count) => {
  const authors = ['Tim Macoveev', 'John Doe', 'Peter Fisk', 'Emma Kim', 'Gary Stopman', 'Anna Musk', 'Lisa Dover'];
  const authorsList = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomNumber(0, authors.length - 1);
    authorsList.push(authors[randomIndex]);
  }

  return authorsList;
};

const generateCommentDatetime = (count) => {
  const datetimesList = [];

  for (let i = 0; i < count; i++) {
    datetimesList.push(dayjs().month(getRandomNumber(0, 11)).date(getRandomNumber(1, 31)).year(getRandomNumber(2005, 2021))
      .hour(getRandomNumber(0, 23)).minute(getRandomNumber(0, 59)).format('YYYY/M/D H:m'));
  }

  return datetimesList;
};

const generateDescription = () => {
  const descriptions = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

  return getRandomRangeFromArray(descriptions, getRandomNumber(1, 5)).join(' ');
};

const generateDate = () => dayjs().month(getRandomNumber(0, 11)).date(getRandomNumber(1, 31)).year(getRandomNumber(1900, 2000));

const generateDuration = () => {
  const hours = getRandomNumber(1, 2);
  const minutes = getRandomNumber(0, 59);
  return dayjs().hour(hours).minute(minutes);
};

const generateFilmCard = () => {
  const id = nanoid();

  const title = generateTitle();
  const rating = getRandomFloat(0, 10, 1);

  const date = generateDate();
  const duration = generateDuration();
  const genre = generateGenre();
  const director = generateDirector();
  const writers = generateWriter().join(', ');
  const actors = generateActor().join(', ');
  const country = generateCountry();

  const poster = filmPosters[title];
  const description = generateDescription();

  const count = getRandomNumber(0, 5);
  const emoji = generateEmoji(count);
  const text = generateCommentText(count);
  const author = generateCommentAuthor(count);
  const datetime = generateCommentDatetime(count);

  const isAddedToWatchlist = Boolean(getRandomNumber(0, 1));
  const isWatched = Boolean(getRandomNumber(0, 1));
  const isFavorite = Boolean(getRandomNumber(0, 1));

  return {
    id,
    title,
    rating,
    info: {
      date,
      duration,
      genre,
      director,
      writers,
      actors,
      country,
    },
    poster,
    description,
    comments: {
      count,
      emoji,
      text,
      author,
      datetime,
    },
    isAddedToWatchlist,
    isWatched,
    isFavorite,
  };
};

export { generateFilmCard };
