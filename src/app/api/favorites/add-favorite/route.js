import connectToDB from '@/database';
import Favorites from '@/models/Favorite';
import { NextResponse } from 'next/server';
const BASE_URL = 'http://localhost:8000/movie';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectToDB();

    const res = await fetch(`${BASE_URL}/addToFavorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: data.uid,
        movieId: data.movieId,
      }),
    });

    const data = await res.json();
    // return data;

    //

    const isFavoriteAlreadyExists = await Favorites.find({
      uid: data.uid,
      movieID: data.movieID,
      accountID: data.accountID,
    });
    if (isFavoriteAlreadyExists && isFavoriteAlreadyExists.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'This is already added to your list',
      });
    }

    const newlyAddedFavorite = await Favorites.create(data);

    if (newlyAddedFavorite) {
      return NextResponse.json({
        success: true,
        message: 'Added to your list successfully',
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Something Went wrong',
      });
    }
  } catch (e) {
    console.log(e);
    return NextResponse.json({
      success: false,
      message: 'Something Went wrong',
    });
  }
}
