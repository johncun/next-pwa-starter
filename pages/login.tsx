import type { NextPage } from 'next';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import { FaExclamation } from 'react-icons/fa';
import { LoaderIcon } from '../components/Loader';
/**
 *
 * Customizations
 *
 */
import Clogo from '../public/icon-192x192.png';
const CAppName = 'Starter';
const CLoginTitle = CAppName + ' Login';

const Login: NextPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [waiting, setWaiting] = useState(false);
  const [inError, setInError] = useState(false);

  const login = async (ev: any) => {
    ev.preventDefault();
    setInError(false);
    setWaiting(true);
    const res = await fetch(`/api/auth`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
      body: JSON.stringify({
        u: email,
        p: password,
      }),
    });
    // setWaiting(false);
    if (res.status === 200) {
      router.push('/');
    } else {
      setWaiting(false);
      setEmail('');
      setPassword('');
      setInError(true);
    }
    // console.log(`res = ${res.status}`);
  };

  return (
    <>
      <Head>
        <title>Starter</title>
        <meta name='description' content='Time tracking app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='w-screen h-screen select-none mx-auto'>
        <div className='mx-auto mt-20 mb-6 border border-slate-700 p-3 shadow-md rounded-lg flex flex-col w-2/3 items-center'>
          <div className='flex flex-col items-center justify-center relative -translate-y-12'>
            <LoaderIcon src={Clogo} wd={120} animate={waiting} />
          </div>

          <div className='text-lg text-slate-400 text-center -mt-10 mb-8'>
            {CLoginTitle}
          </div>
          {inError && (
            <div className='flex justify-center text-red-400 text-sm'>
              <FaExclamation /> Try again...
            </div>
          )}

          <form onSubmit={login}>
            <div
              className={`flex flex-col ${waiting ? 'invisible' : 'visible'}`}
            >
              <input
                placeholder='Email address'
                className='mb-4 mx-3 p-2 border border-slate-700 rounded-sm placeholder-slate-600 text-slate-200 bg-inherit'
                onChange={(ev) => setEmail(ev.target.value)}
                value={email}
              ></input>
              <input
                type='password'
                placeholder='Password'
                className='mb-4 mx-3 p-2 border border-slate-700 rounded-sm placeholder-slate-600 text-slate-200 bg-inherit'
                onChange={(ev) => setPassword(ev.target.value)}
                value={password}
              ></input>
            </div>
            <div className='flex flex-row justify-center mt-4'>
              <button
                type='submit'
                disabled={waiting || email.length < 3 || password.length < 3}
                className={`rounded-lg border-2 shadow-md border-slate-300/50 mx-auto py-3 px-6 my-4 bg-green-600 
            disabled:opacity-40
            hover:scale-110 duration-200 text-white`}
              >
                {!waiting ? 'Log in' : '...'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = ({ req, res }: { req: any; res: any }) => {
  return { props: {} };
};
export default Login;
