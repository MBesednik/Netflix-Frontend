"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { usePathname, useRouter } from "next/navigation";
import { useContext } from "react";
import { GlobalContext } from "@/context";
import { useSession } from "next-auth/react";
import { getAllfavorites } from "@/utils";

const baseUrl = "https://image.tmdb.org/t/p/w500";

export default function MediaItem({
  media,
  searchView = false,
  similarMovieView = false,
  listView = false,
  title,
}) {
  const router = useRouter();
  const pathName = usePathname();
  const {
    setShowDetailsPopup,
    loggedInAccount,
    setFavorites,
    setCurrentMediaInfoIdAndType,
    similarMedias,
    searchResults,
    setSearchResults,
    setSimilarMedias,
    setMediaData,
    mediaData,
  } = useContext(GlobalContext);
  const { data: session } = useSession();
  async function updateFavorites() {
    const res = await getAllfavorites(session?.user?.uid, loggedInAccount?._id);
    if (res)
      setFavorites(
        res.map((item) => ({
          ...item,
          addedToFavorites: true,
        }))
      );
  }

  async function handleAddToFavorites(item, favorite) {
    const { backdrop_path, poster_path, _id, type } = item;

    console.log("favorite", favorite);
    console.log(session?.user?.uid, "session?.user?.uid");
    const res = await fetch("http://localhost:8000/movie/addToFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: _id,
        userId: session?.user?.uid,
      }),
    });

    const data = await res.json();
    console.log(data, "sangam");
    if (data) {
      updateFavorites();
      if (searchView) {
        let updatedSearchResults = [...searchResults];
        const indexOfCurrentAddedMedia = updatedSearchResults.findIndex(
          (item) => item.id === _id
        );

        updatedSearchResults[indexOfCurrentAddedMedia] = {
          ...updatedSearchResults[indexOfCurrentAddedMedia],
          addedToFavorites: (item.addedToFavorites = !item.addedToFavorites),
        };

        setSearchResults(updatedSearchResults);
      } else if (similarMovieView) {
        let updatedSimilarMedias = [...similarMedias];
        const indexOfCurrentAddedMedia = updatedSimilarMedias.findIndex(
          (item) => item.id === _id
        );

        updatedSimilarMedias[indexOfCurrentAddedMedia] = {
          ...updatedSimilarMedias[indexOfCurrentAddedMedia],
          addedToFavorites: (item.addedToFavorites = !item.addedToFavorites),
        };

        setSimilarMedias(updatedSimilarMedias);
      } else {
        let updatedMediaData = [...mediaData];

        let data = toggleFavoriteStatus(updatedMediaData, item._id);

        setMediaData(data);
      }
    }

    console.log(data, "sangam");
  }

  function toggleFavoriteStatus(data, movieId) {
    const newData = JSON.parse(JSON.stringify(data));
    for (let category of newData) {
      for (let movie of category.medias) {
        if (movie._id === movieId) {
          movie.addedToFavorites = !movie.addedToFavorites;
        }
      }
    }
    return newData;
  }

  async function handleRemoveFavorites(item) {
    const { backdrop_path, poster_path, _id, type } = item;
    console.log(item, "id");
    console.log(session?.user?.uid, "session?.user?.uid");
    const res = await fetch("http://localhost:8000/movie/addToFavorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        movieId: _id,
        userId: session?.user?.uid,
      }),
    });

    const data = await res.json();
    if (data) updateFavorites();
  }
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
        ease: [0, 0.71, 0.2, 1.01],
      }}
    >
      <div className="relative cardWrapper h-28 min-w-[180px] cursor-pointer md:h-36 md:min-w-[260px] transform transition duration-500 hover:scale-110 hover:z-[999]">
        <Image
          src={`${baseUrl}${media?.imgUrl}`}
          alt="Media"
          layout="fill"
          className="rounded sm object-cover md:rounded hover:rounded-sm"
          onClick={() => router.push(`/watch/${media?.type}/${media?._id}`)}
        />
        <div className="space-x-3 hidden absolute p-2 bottom-0 buttonWrapper">
          <button
            onClick={() => {
              if (media?.addedToFavorites == true) {
                handleAddToFavorites(media, true);
              } else {
                handleAddToFavorites(media, false);
              }
            }}
            className={`${
              media?.addedToFavorites && "cursor-not-allowed"
            } cursor-pointer border flex p-2 items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90 border-white   bg-black opacity-75 text-black`}
          >
            {media?.addedToFavorites ? (
              <CheckIcon color="#ffffff" className="h-7 w-7" />
            ) : (
              <PlusIcon color="#ffffff" className="h-7 w-7" />
            )}
          </button>
          <button
            onClick={() => {
              setShowDetailsPopup(true);
              setCurrentMediaInfoIdAndType({
                id: media?._id,
              });
            }}
            className="cursor-pointer p-2 border flex items-center gap-x-2 rounded-full  text-sm font-semibold transition hover:opacity-90  border-white  bg-black opacity-75 "
          >
            <ChevronDownIcon color="#fffffff" className="h-7 w-7" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
