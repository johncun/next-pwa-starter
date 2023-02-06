import { Arima_Madurai } from '@next/font/google';
import en from 'date-fns/locale/en-IE';
import { constant, identity, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { useCallback, useEffect, useState } from 'react';
import { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Chart from '../components/Chart';
import { getData, saveData } from '../components/data-layer';
import { Footer } from '../components/Footer';
import Loader from '../components/Loader';
import Top from '../components/Top';
import { Hours } from '../components/types';
import { authPage } from '../components/utils/authCheck';
import { tap } from '../components/utils/utils';

registerLocale('en', en);

const arima = Arima_Madurai({ subsets: ['latin'], weight: ['400'] });

export default function Home() {
  const [data, setData] = useState<O.Option<Hours>>(O.none);
  useEffect(() => {
    setTimeout(async () => setData(O.some(await getData())), 0);
  }, []);

  const [current, setCurrent] = useState(new Date());
  const [timeInput, setTimeInput] = useState<O.Option<number>>(O.none);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    setDisabled(!current || O.isNone(timeInput));
  }, [timeInput, current]);

  const onChangeDate = (newdate: Date) => {
    setCurrent(newdate);
  };
  const onChangeHours = (ev: any) => {
    const w = (ev.target.value || '').trim();
    if (!w || isNaN(w)) setTimeInput(O.none);
    else setTimeInput(O.some(~~(+w * 10.0) / 10.0));
  };
  const onAdd = useCallback(() => {
    if (!current || !timeInput) return;
    pipe(
      data,
      O.map((hours) => {
        const days = {
          ...hours.days,
          [current.toISOString().slice(0, 10)]: pipe(
            timeInput,
            O.getOrElse(constant(0))
          ),
        };
        setData(
          O.some({
            days,
          })
        );
        saveData({ days });
      })
    );
  }, [current, data, timeInput]);

  return (
    <>
      <Head>
        <title>Starter</title>
        <meta name='description' content='Starter' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {pipe(
        data,
        O.map((hrs) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <motion.div
              animate={{ opacity: [0, 1] }}
              transition={{ duratation: 0.5 }}
              className='w-screen h-screen
            text-slate-400 overflow-hidden flex flex-col justify-evenly'
            >
              <Top
                onChangeDate={onChangeDate}
                current={current}
                hours={pipe(
                  timeInput,
                  O.foldW(() => undefined, identity)
                )}
                onChangeHours={onChangeHours}
                onAdd={onAdd}
                disabled={disabled}
              />
              <Chart data={hrs} />
              <Footer data={hrs} />
            </motion.div>
          );
        }),
        O.getOrElse(() => <Loader wd={190} />)
      )}
    </>
  );
}

export const getServerSideProps = async function ({ req }: { req: any }) {
  const result = pipe(
    await authPage(req)(),
    tap('getServerSideProps after authPage'),
    O.foldW(() => ({ props: {} }), identity)
  );
  return result;
};
