import connectToDB from '@/database';
import Account from '@/models/Account';
import { hash } from 'bcryptjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  try {
    await connectToDB();

    const { name, pin, uid } = await req.json();

    const isAccountAlreadyExists = await getUsers(uid);
    console.log(isAccountAlreadyExists);

    let containsName = isAccountAlreadyExists.some(
      (user) => user.name === name
    );

    if (isAccountAlreadyExists && containsName) {
      return NextResponse.json({
        success: false,
        message: 'Please try with a different name',
      });
    }

    console.log(isAccountAlreadyExists);

    if (isAccountAlreadyExists && isAccountAlreadyExists.length >= 4) {
      return NextResponse.json({
        success: false,
        message: 'You can only add max 4 accounts',
      });
    }

    const newlyCreatedAccount = await register({
      name,
      pin: pin,
      uid,
    });

    if (newlyCreatedAccount) {
      return NextResponse.json({
        success: true,
        message: 'Account created successfully',
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

async function login(uid) {
  const apiUrl = `${BASE_URL}/account/login`;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
      }),
    });
  } catch (error) {
    console.error(`Error getting account: ${uid}, Error: `, error);
  }
}

async function register(name, pin, uid) {
  const apiUrl = `${BASE_URL}/account`;

  try {
    await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name,
        pin: pin,
        uid: uid,
      }),
    });
  } catch (error) {
    console.error(`Error creating new account: ${uid}, Error: `, error);
  }
}

async function getUsers(uid) {
  const apiUrl = `${BASE_URL}/user/${uid}`;

  try {
    await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uid: uid,
      }),
    });
  } catch (error) {
    console.error(`Error creating new account: ${uid}, Error: `, error);
  }
}

const BASE_URL = 'http://localhost:8000';
