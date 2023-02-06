import { motion } from 'framer-motion';
import Image from 'next/image';
import { ForwardedRef, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { FaPlus } from 'react-icons/fa';
import logo from '../public/icon-192x192.png';
import { appear, bounce, isWeekday } from './utils/utils';

const Top = ({
  onChangeDate,
  current,
  hours,
  onChangeHours,
  onAdd,
  disabled,
}: {
  onChangeDate: (d: Date) => void;
  current: Date;
  hours?: number;
  onChangeHours: (ev: any) => void;
  onAdd: () => void;
  disabled: boolean;
}) => {
  return (
    <div className='flex flex-col items-center justify-between'>
      <div className='fixed top-0 text-red-600'>STARTER</div>
      <motion.div animate={appear} transition={bounce}>
        <Image className='opacity-70' src={logo} alt='logo' width='120' />
      </motion.div>

      <motion.div
        animate={appear}
        transition={bounce}
        className='mt-2 flex flex-row justify-center items-center w-11/12'
      >
        <div className='border border-slate-600 rounded-2xl p-1 bg-[#0a0807] w-[12em] text-center'>
          <DatePicker
            // showTimeSelect
            onChange={onChangeDate}
            selected={current}
            filterDate={isWeekday}
            dateFormat='eee dd MMM'
            customInput={<DateInput />}
          />
        </div>
      </motion.div>
      <div className='flex flex-col items-center justify-between  mt-4'>
        <input
          className='w-24 outline-none text-2xl text-center border bg-black border-slate-600'
          type='number'
          value={hours}
          onChange={onChangeHours}
        ></input>
        <div className='text-slate-500'>hours</div>
      </div>
      <motion.button
        animate={appear}
        transition={bounce}
        onClick={onAdd}
        disabled={disabled}
        className='my-3 bg-[green] p-4 border border-slate-300 rounded-full  
      disabled:text-white disabled:bg-[#8C8693] text-[#E8F3FB]'
      >
        <FaPlus />
      </motion.button>
    </div>
  );
};

const DateInput = forwardRef(
  (props: any, ref: ForwardedRef<HTMLButtonElement>) => (
    <button className='w-1/2' onClick={props.onClick} ref={ref}>
      {props.value}
    </button>
  )
);
DateInput.displayName = 'DateInput';

export default Top;
