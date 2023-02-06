import { motion } from 'framer-motion';
import { Hours } from './types';
import { appear, avg, bounce } from './utils/utils';

export const Footer = ({ data }: { data?: Hours }) => {
  if (!data) return null;
  return (
    <motion.div
      animate={appear}
      transition={bounce}
      className='flex flex-row justify-center mt-2'
    >
      <div
        className='rounded-2xl w-4/5 text-center py-1 text-xl justify-center 
  flex flex-row items-center text-[#8C8693] bg-[#E8F3FB] mt-1'
      >
        {avg(data)}
      </div>
    </motion.div>
  );
};
