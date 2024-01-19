'use client';

import CircleLoader from '@/components/circle-loader';
import CommonLayout from '@/components/common-layout';
import ManageAccounts from '@/components/manage-accounts';
import UnauthPage from '@/components/unauth-page';
import { GlobalContext } from '@/context';
import {
  getAllfavorites,
  getPopularMedias,
  getTopratedMedias,
  getTrendingMedias,
  getRecommendation,
} from '@/utils';
import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';

export default function Browse() {
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    setPageLoader,
    pageLoader,
  } = useContext(GlobalContext);

  const { data: session } = useSession();

  console.log(session, 'session');

  useEffect(() => {
    async function getAllMedias() {
      const recomended = await getRecommendation(session?.user?.uid);
      const topratedMovieShows = await getTopratedMedias('movie');
      const trendingMovieShows = await getTrendingMedias('movie');
      const popularMovieShows = await getPopularMedias('movie');

      const allFavorites = await getAllfavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );

      setMediaData([
        ...[
          {
            title: 'Recomended',
            medias: recomended,
          },
          {
            title: 'Recomended by others',
            medias: trendingMovieShows,
          },
          {
            title: 'Top 10 by rates',
            medias: popularMovieShows,
          },
          {
            title: 'Most popular',
            medias: topratedMovieShows,
          },
        ],
      ]);

      setPageLoader(false);
    }

    getAllMedias();
  }, []);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  return (
    <main className='flex min-h-screen flex-col'>
      <CommonLayout mediaData={mediaData} />
    </main>
  );
}

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
