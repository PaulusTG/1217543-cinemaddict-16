const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

export default class ApiService {
  #endPoint = null;
  #authorization = null;

  constructor(endPoint, authorization) {
    this.#endPoint = endPoint;
    this.#authorization = authorization;
  }

  get films() {
    return this.#load({ url: 'movies' })
      .then(ApiService.parseResponse);
  }

  getComments = async (filmId) => this.#load({ url: `comments/${filmId}` })
    .then(ApiService.parseResponse)

  updateFilm = async (film) => {
    const response = await this.#load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(film)),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    const parsedResponse = await ApiService.parseResponse(response);

    return parsedResponse;
  }

  #load = async ({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) => {
    headers.append('Authorization', this.#authorization);

    const response = await fetch(
      `${this.#endPoint}/${url}`,
      { method, body, headers },
    );

    try {
      ApiService.checkStatus(response);
      return response;
    } catch (err) {
      ApiService.catchError(err);
    }
  }

  #adaptToServer = (film) => {
    const adaptedFilm = {
      ...film,
      'user_details': {
        'watchlist': film.isAddedToWatchlist,
        'favorite': film.isFavorite,
        'already_watched': film.isWatched,
        'watching_date': film.watchingDate,
      },
      'film_info': {
        'title': film.filmInfo.title,
        'alternative_title': film.filmInfo.alternativeTitle,
        'total_rating': film.filmInfo.rating,
        'age_rating': film.filmInfo.ageRating,
        'runtime': film.filmInfo.duration,
        'genre': film.filmInfo.genre,
        'director': film.filmInfo.director,
        'writers': film.filmInfo.writers,
        'actors': film.filmInfo.actors,
        'poster': film.filmInfo.poster,
        'description': film.filmInfo.description,
        'release': {
          'date': film.filmInfo.date,
          'release_country': film.filmInfo.country,
        },
      }
    };

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.isAddedToWatchlist;
    delete adaptedFilm.isFavorite;
    delete adaptedFilm.isWatched;
    delete adaptedFilm.watchingDate;

    return adaptedFilm;
  }

  static parseResponse = (response) => response.json();

  static checkStatus = (response) => {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
  }

  static catchError = (err) => {
    throw err;
  }
}
