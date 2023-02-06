import { flow, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TO from 'fp-ts/TaskOption';
import { jwtVerify } from 'jose';
import type { NextApiRequest, NextApiResponse } from 'next';
import * as R from 'ramda';

const verify =
  (secret: string) =>
  (token: string): T.Task<boolean> =>
    pipe(
      () => jwtVerify(token, new TextEncoder().encode(secret)),
      T.map(
        flow(
          R.path<string>(['payload', 'payload', 'data']),
          // R.tap(console.log),
          R.equals(process.env.APP_ID)
        )
      )
    );

interface Error {
  message: string;
}

interface ErrorData {
  redirect: {
    destination: string;
    permanent: boolean;
  };
}

export function authPage2(req: any): TO.TaskOption<ErrorData> {
  const redirector: ErrorData = {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };

  const secureToken = req.cookies['auth-token'];
  if (!secureToken) return TO.of(redirector);
  return pipe(
    T.of(secureToken),
    T.chain(verify(process.env.JWT_SECRET || '')),
    T.map((valid) => (valid ? O.none : O.some(redirector)))
  );
}
export function authPage(req: any): TO.TaskOption<ErrorData> {
  const redirector: O.Option<ErrorData> = O.some({
    redirect: {
      destination: '/login',
      permanent: false,
    },
  });

  return pipe(
    O.fromNullable(req.cookies['auth-token']),
    O.map(verify(process.env.JWT_SECRET || '')),
    O.fold(
      () => T.of(redirector),
      T.map((valid) => (valid ? O.none : redirector))
    )
  );
}

export function validateApiCall(req: any): T.Task<boolean> {
  // console.log({ c: req.cookies });
  return pipe(
    T.of(req.cookies['auth-token']),
    T.chain(verify(process.env.JWT_SECRET || ''))
  );
}

export const onAuthenticated = async <T>(
  req: NextApiRequest,
  res: NextApiResponse<T>,
  handler: () => void
) => {
  if (!pipe(await validateApiCall(req)())) {
    res.status(401);
    return;
  }
  handler();
};
