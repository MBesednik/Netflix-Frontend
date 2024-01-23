const API_KEY = 'b7265502060ef55cb5938693ecc1e41d';
const BASE_URL = 'http://localhost:8000/movie';

export const getTrendingMedias = async () => {
  try {
    const res = await fetch(`${BASE_URL}/moviesByOther`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('MAT1', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getRecommendation = async (id) => {
  console.log('USERID', id);
  try {
    const res = await fetch(`${BASE_URL}/recommendForUser/${id}`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('MAT1', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getTopratedMedias = async () => {
  try {
    const res = await fetch(`${BASE_URL}/mostRated`, {
      method: 'GET',
    });

    const data = await res.json();
    return data.movies;
  } catch (e) {
    console.log(e);
  }
};

export const getPopularMedias = async () => {
  try {
    const res = await fetch(`${BASE_URL}/popularMoviesAllTime`, {
      method: 'GET',
    });

    const data = await res.json();
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getTVorMoviesByGenre = async (type, id) => {
  try {
    const res = await fetch(`${BASE_URL}/genre/${id}`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('MAA', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getTVorMovieVideosByID = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/movieDetails/${id}`, {
      method: 'GET',
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

// OLD
export const getTVorMovieSearchResults = async (type, query) => {
  try {
    const res = await fetch(
      `${BASE_URL}/search/${type}?api_key=${API_KEY}&include_adult=false&language=en-US&query=${query}`,
      {
        method: 'GET',
      }
    );

    const data = await res.json();

    return data && data.results;
  } catch (e) {
    console.log(e);
  }
};

export const getTVorMovieDetailsByID = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/movieDetails/${id}`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('MM', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

// OLD
export const getSimilarTVorMovies = async (genre) => {
  try {
    const res = await fetch(`${BASE_URL}/genre/${genre}`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('SIMILAR', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getAllfavorites = async (uid, accountID) => {
  try {
    console.log('favoriteAccountID', accountID);
    console.log('favoriteUid', uid);
    const res = await fetch(`${BASE_URL}/favoriteMovies/${accountID} `, {
      method: 'GET',
    });

    const data = await res.json();
    if (data.message == null) {
      console.log('getAllfavorites_response', data);
      return data;
    } else {
      return [];
    }
  } catch (e) {
    console.log(e);
  }
};

// Mapping movies from API to mongoDb ## only for the first time
const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function mapFirstGenre(genreIds) {
  if (genreIds.length === 0) return '';

  const firstGenreId = genreIds[0];
  const foundGenre = genres.find((genre) => genre.id === firstGenreId);
  return foundGenre ? foundGenre.name : null;
}

async function fetchYouTubeTrailerKey(movieId) {
  const apiKey = 'b7265502060ef55cb5938693ecc1e41d'; // Replace with your actual API key
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const trailer = data.results.find(
      (video) => video.type === 'Trailer' && video.site === 'YouTube'
    );
    return trailer ? trailer.key : '';
  } catch (error) {
    console.error('Error fetching YouTube trailer key:', error);
    return '';
  }
}

async function saveMoviesToDatabase(movie) {
  const apiUrl = 'http://localhost:8000/movie';
  const youtubeKey = await fetchYouTubeTrailerKey(movie.id); // Fetch YouTube trailer key

  try {
    console.log('LOLOLO_AWA', movie);
    const genre = mapFirstGenre(movie.genre_ids);
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        movieId: movie.id,
        name: movie.title,
        imgUrl: movie.poster_path,
        youtubeLink: youtubeKey,
        genre: genre,
        popularity: movie.popularity,
        releaseDate: movie.release_date,
        rating: movie.vote_average,
      }),
    });

    console.log(`Request made to save movie: ${movie.title}`);
  } catch (error) {
    console.error(`Error saving movie: ${movie.title}, Error: `, error);
  }
}
