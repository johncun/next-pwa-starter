import bcrypt from 'bcrypt';
import { setCookie } from 'cookies-next';
import { SignJWT } from 'jose';
import { MongoClient } from 'mongodb';

import type { NextApiRequest, NextApiResponse } from 'next';

type Data = any | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') {
    res.status(405);
    return;
  }

  const { u, p } = JSON.parse(req.body);
  const result = await fetchUser(u, p);
  if (!result) {
    res.status(401).json({});
    return;
  }
  const token = await sign(
    { data: process.env.APP_ID },
    process.env.JWT_SECRET || ''
  );

  setCookie('auth-token', token, {
    req,
    res,
    maxAge: 7 * 24 * 60 * 60,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    sameSite: 'strict',
    secure: true,
    httpOnly: true,
  });
  res.status(200).json({ message: 'ok' });
}

const fetchUser = async (u: string, p: string): Promise<boolean> => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  try {
    await client.connect();
    const user = await client
      .db(process.env.DB_NAME)
      .collection(process.env.USERS_COLLECTION || '')
      .findOne();
    if (!user) return false;
    return await bcrypt.compare(p, user.p);
  } catch (e: any) {
    return false;
  } finally {
    client.close();
  }
};

async function sign(payload: any, secret: string) {
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 7 * 24 * 60 * 60; // one week

  return new SignJWT({ payload })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(secret));
}
