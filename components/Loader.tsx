import Image, { StaticImageData } from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import logo from '../public/icon-192x192.png';

export default function Loader({ wd }: { wd: number }) {
  return (
    <AnimatePresence>
      <motion.div
        exit={{ opacity: 0 }}
        className='w-screen h-screen
  text-slate-400 overflow-hidden relative flex flex-col items-center justify-center'
      >
        <LoaderIcon src={logo} wd={wd} animate={true} />
      </motion.div>
    </AnimatePresence>
  );
}

export const LoaderIcon = ({
  src,
  wd,
  animate,
}: {
  src: StaticImageData;
  wd: number;
  animate: boolean;
}) => (
  <div className='relative' style={{ width: wd, height: wd }}>
    {animate && (
      <>
        <div
          className='absolute'
          style={{ left: -(0.07 / 2) * wd, top: -(0.07 / 2) * wd }}
        >
          <motion.div
            className='rounded-full bg-slate-400'
            style={{ width: wd * 1.07, height: wd * 1.07 }}
            animate={{ scale: [0, 1], opacity: [0.5, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.4 }}
          ></motion.div>
        </div>
        <div
          className='absolute'
          style={{ left: -(0.07 / 2) * wd, top: -(0.07 / 2) * wd }}
        >
          <motion.div
            className='rounded-full bg-[#130e0c]'
            style={{ width: wd * 1.07, height: wd * 1.07, opacity: 1 }}
            animate={{ scale: [0, 1] }}
            transition={{
              repeat: Infinity,
              delay: 0.1,
              duration: 1.4,
              ease: 'easeIn',
              //   timingfunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          ></motion.div>
        </div>
      </>
    )}
    <div className='absolute z-10'>
      <Image className='' src={src} alt='logo' width={`${wd}`} />
    </div>
  </div>
);
