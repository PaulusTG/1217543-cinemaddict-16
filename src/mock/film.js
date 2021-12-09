import dayjs from 'dayjs';
import { getRandomNumber, getRandomFloat, getRandomRangeFromArray } from '../utils.js';

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
  const director = ['Anthony Mann', 'Jonathan Favreau', 'Kevin Feige', 'Christopher Nolan', 'James Cameron', 'James Gunn Jr.'];

  const randomIndex = getRandomNumber(0, director.length - 1);

  return director[randomIndex];
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
  const emojiList = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomNumber(0, emojies.length - 1);
    emojiList.push(emojies[randomIndex]);
  }

  return emojiList;
};

const generateCommentText = (count) => {
  const texts = ['Interesting setting and a good cast', 'Booooooooooring', 'Very very old. Meh', 'Almost two hours? Seriously?', 'WOW! It`s cool!'];

  return getRandomRangeFromArray(texts, count);
};

const generateCommentAuthor = (count) => {
  const authors = ['Tim Macoveev', 'John Doe', 'Peter Fisk', 'Emma Kim', 'Gary Stopman', 'Anna Musk', 'Lisa Dover'];
  const authorList = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = getRandomNumber(0, authors.length - 1);
    authorList.push(authors[randomIndex]);
  }

  return authorList;
};

const generateCommentDatetime = (count) => {
  const datetimeList = [];

  for (let i = 0; i < count; i++) {
    datetimeList.push(dayjs().month(getRandomNumber(0, 11)).date(getRandomNumber(1, 31)).year(getRandomNumber(2005, 2021))
      .hour(getRandomNumber(0, 23)).minute(getRandomNumber(0, 59)).format('YYYY/M/D H:m'));
  }

  return datetimeList;
};

const generateDescription = () => {
  const description = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.', 'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.', 'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.', 'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus.', 'In rutrum ac purus sit amet tempus.'];

  return getRandomRangeFromArray(description, getRandomNumber(1, 5)).join(' ');
};

const generateDate = () => dayjs().month(getRandomNumber(0, 11)).date(getRandomNumber(1, 31)).year(getRandomNumber(1900, 2000));

const generateDuration = () => {
  const hours = getRandomNumber(1, 2);
  const minutes = getRandomNumber(0, 59);
  return dayjs().hour(hours).minute(minutes);
};

const generateFilmCard = () => {
  const title = generateTitle();
  const date = generateDate();
  const duration = generateDuration();
  const director = generateDirector();
  const writers = generateWriter().join(', ');
  const actors = generateActor().join(', ');
  const country = generateCountry();
  const genre = generateGenre();

  const count = getRandomNumber(0, 5);
  const emoji = generateEmoji(count);
  const text = generateCommentText(count);
  const author = generateCommentAuthor(count);
  const datetime = generateCommentDatetime(count);

  return {
    title,
    rating: getRandomFloat(0, 10, 1),
    info: {
      date,
      duration,
      genre,
      director,
      writers,
      actors,
      country,
    },
    poster: filmPosters[title],
    description: generateDescription(),
    comments: {
      count,
      emoji,
      text,
      author,
      datetime,
    },
    isAddedToWatchlist: Boolean(getRandomNumber(0, 1)),
    isWatched: Boolean(getRandomNumber(0, 1)),
    isFavorite: Boolean(getRandomNumber(0, 1)),
  };
};

export { generateFilmCard };
