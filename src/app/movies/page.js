'use client';

import CircleLoader from '@/components/circle-loader';
import CommonLayout from '@/components/common-layout';
import ManageAccounts from '@/components/manage-accounts';
import UnauthPage from '@/components/unauth-page';
import { GlobalContext } from '@/context';
import { getAllfavorites, getTVorMoviesByGenre } from '@/utils';
import { useSession } from 'next-auth/react';
import { useContext, useEffect } from 'react';

export default function medias() {
  const {
    loggedInAccount,
    mediaData,
    setMediaData,
    setPageLoader,
    pageLoader,
  } = useContext(GlobalContext);

  const { data: session } = useSession();

  useEffect(() => {
    async function getAllMedias() {
      const action = await getTVorMoviesByGenre('movie', 'Action');
      const adventure = await getTVorMoviesByGenre('movie', 'Adventure');
      const crime = await getTVorMoviesByGenre('movie', 'Crime');
      const comedy = await getTVorMoviesByGenre('movie', 'Comedy');
      const family = await getTVorMoviesByGenre('movie', 'Family');
      const mystery = await getTVorMoviesByGenre('movie', 'Mystery');
      const romance = await getTVorMoviesByGenre('movie', 'Romance');
      const scifiAndFantasy = await getTVorMoviesByGenre(
        'movie',
        'Science Fiction'
      );
      const war = await getTVorMoviesByGenre('movie', 'War');
      const history = await getTVorMoviesByGenre('movie', 'History');
      const drama = await getTVorMoviesByGenre('movie', 'Drama');
      const thriller = await getTVorMoviesByGenre('movie', 'Thriller');
      const horror = await getTVorMoviesByGenre('movie', 'Horror');

      console.log(action, 'action');
      setMediaData(
        [
          {
            title: 'Action',
            medias: action,
          },
          {
            title: 'Adventure',
            medias: adventure,
          },
          {
            title: 'Comedy',
            medias: comedy,
          },
          {
            title: 'History',
            medias: history,
          },
          {
            title: 'Romance',
            medias: romance,
          },
          {
            title: 'Sci-Fi and Fantasy',
            medias: scifiAndFantasy,
          },
          {
            title: 'Thriller',
            medias: thriller,
          },
          {
            title: 'Dramas',
            medias: drama,
          },
        ].map((item) => ({
          ...item,
        }))
      );
      setPageLoader(false);
    }

    getAllMedias();
  }, [loggedInAccount]);

  if (session === null) return <UnauthPage />;
  if (loggedInAccount === null) return <ManageAccounts />;
  if (pageLoader) return <CircleLoader />;

  console.log(mediaData, 'mediaData');

  return (
    <main className='flex min-h-screen flex-col'>
      <CommonLayout mediaData={mediaData} />
    </main>
  );
}
