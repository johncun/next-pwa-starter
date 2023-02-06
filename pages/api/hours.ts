import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { MongoClient, UpdateResult } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as R from 'ramda';
import { Hours } from '../../components/types';
import { onAuthenticated } from '../../components/utils/authCheck';

type Data = any | { message: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await onAuthenticated(req, res, async () => {
    if (!R.includes(req.method, ['POST', 'GET'])) {
      res.status(405);
      return;
    }

    await pipe(
      TO.fromNullable(req.method),
      TO.chain(TO.fromPredicate(R.equals('GET'))),
      TO.fold(handlePost(res, req.body), handleGet(res))
    )();
  });
}

const fetchHours = async (): Promise<O.Option<Hours>> => {
  const client = new MongoClient(process.env.MONGODB_URI as string);
  try {
    await client.connect();
    const timetrackDoc = await client
      .db(process.env.DB_NAME)
      .collection('timetrack')
      .findOne();
    return !timetrackDoc ? O.none : O.some({ days: timetrackDoc.days });
  } catch (e: any) {
    return O.none;
  } finally {
    client.close();
  }
};

const saveHours = async (data: Hours): Promise<O.Option<UpdateResult>> => {
  // To stop changes in starter
  return O.some({} as unknown as UpdateResult);

  // Actual update code

  // const client = new MongoClient(process.env.MONGODB_URI as string);
  // try {
  //   client.connect();
  //   const db = client.db(process.env.DB_NAME);
  //   const hours = await db.collection('timetrack').findOne();
  //   return !!hours
  //     ? O.some(
  //         await db
  //           .collection('timetrack')
  //           .updateOne({ _id: hours._id }, { $set: { days: data.days } })
  //       )
  //     : O.none;
  // } catch (e: any) {
  //   return O.none;
  // } finally {
  //   client.close();
  // }
};

const handleGet = (res: NextApiResponse) => () =>
  pipe(
    TO.fromTask(() => fetchHours()),
    TO.map(
      O.fold(
        () => T.never,
        (w) => T.of(res.status(200).json(w))
      )
    )
  );

const handlePost = (res: NextApiResponse, body: Hours) => () =>
  pipe(
    TO.fromTask(() => saveHours(body)),
    TO.map(
      O.fold(
        () => T.never,
        () => T.of(res.status(200).json({ message: 'saved' }))
      )
    )
  );
