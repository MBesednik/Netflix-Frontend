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
      const topratedMovieShows = await getTopratedMedias();
      const trendingMovieShows = await getTrendingMedias();
      const popularMovieShows = await getPopularMedias();

      const allFavorites = await getAllfavorites(
        session?.user?.uid,
        loggedInAccount?._id
      );
      // Convert allFavorites into a Set for faster lookups
      const favoriteIds = new Set(allFavorites.map((fav) => fav._id));
      console.log('favoriteIds', favoriteIds);
      console.log('recomended', recomended);
      const processData = (data, title) => ({
        title: title,
        medias: data.map((mediaItem) => ({
          ...mediaItem,
          addedToFavorites: favoriteIds.has(mediaItem._id),
        })),
      });

      const newMediaData = [];

      if (recomended != null && recomended.length > 0) {
        newMediaData.push(processData(recomended, 'Recommended'));
      }
      if (trendingMovieShows != null && trendingMovieShows.length > 0) {
        newMediaData.push(
          processData(trendingMovieShows, 'Recommended by Others')
        );
      }
      if (popularMovieShows != null && popularMovieShows.length > 0) {
        newMediaData.push(processData(popularMovieShows, 'Top 10 by Rates'));
      }
      if (topratedMovieShows != null && topratedMovieShows.length > 0) {
        newMediaData.push(processData(topratedMovieShows, 'Most Popular'));
      }

      console.log('newMediaData', newMediaData);
      setMediaData(newMediaData);
      setPageLoader(false);
    }

    getAllMedias();
  }, []);
  if (pageLoader) return <CircleLoader />;
  console.log('MEDIA_DATA', mediaData);
  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  return (
    <main className='flex min-h-screen flex-col'>
      <CommonLayout mediaData={mediaData} />
    </main>
  );
}
