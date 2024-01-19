const API_KEY = 'b7265502060ef55cb5938693ecc1e41d';
const BASE_URL = 'http://localhost:8000/movie';

export const getTrendingMedias = async (type) => {
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

export const getTopratedMedias = async (type) => {
  try {
    const res = await fetch(`${BASE_URL}/mostRated`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('MAT2', data);
    return data.movies;
  } catch (e) {
    console.log(e);
  }
};

export const getPopularMedias = async (type) => {
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
    const res = await fetch(`${BASE_URL}//genre/${id}`, {
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
    const res = await fetch(`http://localhost:8000/movie/movieDetails/${id}`, {
      method: 'GET',
    });

    const data = await res.json();

    return data;
  } catch (e) {
    console.log(e);
  }
};

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
    const res = await fetch(`http://localhost:8000/movie/movieDetails/${id}`, {
      method: 'GET',
    });

    const data = await res.json();
    console.log('MM', data);
    return data;
  } catch (e) {
    console.log(e);
  }
};

export const getSimilarTVorMovies = async (type, id) => {
  try {
    const res = await fetch(
      `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}&language=en-US`,
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

export const getAllfavorites = async (uid, accountID) => {
  try {
    const res = await fetch(
      `/api/favorites/get-all-favorites?id=${uid}&accountID=${accountID}`,
      {
        method: 'GET',
      }
    );

    const data = await res.json();

    return data && data.data;
  } catch (e) {
    console.log(e);
  }
};
