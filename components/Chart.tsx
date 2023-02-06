import { ChartX } from './ChartX';
import { Hours } from './types';

const Chart = ({ data }: { data: Hours }) => {
  return (
    <div className='relative flex flex-col h-52 my-0 items-center mx-8'>
      <ChartX entries={data} />
    </div>
  );
};

export default Chart;

// export const Chart = ({ data }: { data: Hours }) => {
//   console.log({ data });
//   if (!data || !data.days || !Object.keys(data.days).length) return null;
//   return (
//     <ResponsiveContainer width='80%' height='35%' className='mx-auto h-10 mt-2'>
//       <LineChart
//         data={Object.keys(data.days)
//           .sort()
//           .map((day) => ({
//             day: new Date(day).getTime(),
//             value: data.days[day],
//           }))}
//       >
//         <Line
//           dataKey={(_) => _.value}
//           fill='#8884d8'
//           type='monotone'
//           label={<CustomLabel />}
//           stroke='#E8F3FB'
//           strokeWidth={4}
//           dot={true}
//           // dot={<CustomizedDot />}
//         />
//         <YAxis
//           domain={[0, 10]}
//           allowDecimals={true}
//           axisLine={{ strokeWidth: 2 }}
//           width={30}
//           tick={<NumberTick angle={0} />}
//           tickCount={10}
//           interval={'preserveStartEnd'}
//         />
//         <XAxis
//           dataKey='day'
//           axisLine={{ strokeWidth: 2 }}
//           type='number'
//           domain={['dataMin', 'dataMax']}
//           angle={-90}
//           tickCount={5}
//           tickSize={10}
//           minTickGap={0}
//           interval={4}
//           scale='time'
//           padding={{ left: 20, right: 20 }}
//           height={70}
//           width={5}
//           dy={30}
//           tick={<DateTick angle={-60} />}
//         ></XAxis>
//       </LineChart>
//     </ResponsiveContainer>
//   );
// };
