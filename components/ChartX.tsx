import * as O from 'fp-ts/Option';
import * as d3 from 'd3';
import {
  eachMonthOfInterval,
  eachWeekendOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from 'date-fns';
import { motion } from 'framer-motion';
import useMeasure from 'react-use-measure';
import { Hours } from './types';
import { pipe } from 'fp-ts/lib/function';

const byKey = <K extends string, V>([ak]: [K, V], [bk]: [K, V]): number =>
  ak.localeCompare(bk);

export function ChartX({ entries }: { entries: Hours }) {
  const [ref, bounds] = useMeasure();

  const es = Object.entries(entries.days)
    .sort(byKey)
    .map(([k, v]: [string, number]) => {
      return [new Date(k).getTime(), v] as Entry;
    });

  return (
    <div className='relative h-full w-full' ref={ref}>
      {bounds.width > 0 && (
        <ChartInner data={es} width={bounds.width} height={bounds.height} />
      )}
    </div>
  );
}

// return (
//   <div className='relative h-full w-full' ref={ref}>
//     {bounds.width > 0 && (
//       <ChartInner data={data} width={bounds.width} height={bounds.height} />
//     )}
//   </div>
// );

type Entry = [number, number];

function ChartInner({
  data,
  width,
  height,
}: {
  data: Entry[];
  width: number;
  height: number;
}) {
  if (data.length === 0) return null;
  const ys: number[] = data.map((d: Entry) => d[1]);

  const margin = {
    top: 10,
    right: 0,
    bottom: 40,
    left: 20,
  };

  const startDay = startOfMonth(data[0][0]);
  const endDay = endOfMonth(data[data.length - 1][0]);
  const months = eachMonthOfInterval({ start: startDay, end: endDay });
  const weekends = eachWeekendOfInterval({ start: startDay, end: endDay });

  const xScale = d3
    .scaleTime()
    .domain([startDay, endDay])
    .range([margin.left, width - margin.right]);

  const mx = ys.reduce(
    (prev, curr) => Math.max(prev, curr),
    Number.MIN_SAFE_INTEGER
  );
  const mn = ys.reduce(
    (prev, curr) => Math.min(prev, curr),
    Number.MAX_SAFE_INTEGER
  );
  const aHt = ys.reduce((prev, curr) => prev + curr, 0) / (ys.length || 1);
  const yScale = d3
    .scaleLinear()
    .domain([mn - 2, mx + 2])
    .range([height - margin.bottom, margin.top]);

  const line = d3
    .line()
    .x((d: Entry) => xScale(d[0]))
    .y((d: Entry) => yScale(d[1]));
  const d = O.fromNullable(line(data));

  const avgline = d3
    .line()
    .x((d: Entry) => xScale(d[0]))
    .y((d: Entry) => yScale(d[1]))([
    [startDay.getTime(), aHt],
    [endDay.getTime(), aHt],
  ]);
  console.log({ avgline });

  return (
    <>
      <svg className='' viewBox={`0 0 ${width} ${height}`}>
        <SvgWeekends
          weekends={weekends}
          y={margin.top}
          ht={height - margin.bottom}
          xScale={xScale}
          color='#4b5a46'
        />

        <SvgXAxis
          months={months}
          xScale={xScale}
          y={height - margin.bottom}
          yText={height - 5}
        />
        <SvgYAxis
          yScale={yScale}
          x1={margin.left}
          x2={width - margin.right}
          tickCount={5}
        />

        <AvgLine
          value={avgline}
          x1={margin.left}
          x2={width - margin.right}
          y={yScale(aHt)}
          xText={width - 40}
          yText={-10}
          text={aHt.toFixed(1)}
        />
        <Line value={d} />
        <Points data={data} xScale={xScale} yScale={yScale} months={months} />
      </svg>
    </>
  );
}

const Line = ({ value }: { value: O.Option<string> }) => {
  return (
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 3 }}
      d={pipe(
        value,
        O.getOrElseW(() => undefined)
      )}
      fill='none'
      stroke='#009cdc'
      strokeWidth='2.5'
    />
  );
};

const Points = ({
  data,
  xScale,
  yScale,
  months,
}: {
  data: Entry[];
  xScale: d3.ScaleTime<number, number, never>;
  yScale: d3.ScaleLinear<number, number, never>;
  months: Date[];
}) => {
  return (
    <>
      {data.map((d, i) => (
        <motion.circle
          animate={{ opacity: [0, 1], transition: { delay: 0.2 * i } }}
          key={d[0]}
          r='5'
          cx={xScale(d[0])}
          cy={yScale(d[1])}
          fill='#111'
          strokeWidth={2}
          stroke={
            months.findIndex((m) => isSameMonth(m, d[0])) % 2 === 1
              ? 'white'
              : '#ddd'
          }
        />
      ))}
    </>
  );
};

const AvgLine = ({
  value,
  x1,
  x2,
  y,
  xText,
  yText,
  text,
}: {
  value: string | null;
  x1: number;
  x2: number;
  y: number;
  xText: number;
  yText: number;
  text: string;
}) => {
  return (
    <>
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
        d={value || undefined}
        fill='none'
        stroke='#e8f3fb80'
        strokeWidth='1'
      />
      <motion.g
        animate={{ opacity: [0, 1] }}
        transition={{ duration: 0.7 }}
        transform={`translate(0,${y})`}
        className='text-[#e8f3fb80]'
      >
        <rect
          y={yText}
          x={xText}
          width={40}
          height={25}
          fill={'black'}
          rx={5}
        ></rect>
        <text
          // alignmentBaseline='middle'
          y={yText + 12.5}
          x={xText + 20}
          className='text-[.7rem]'
          fill='currentColor'
          dominant-baseline='middle'
          text-anchor='middle'
        >
          {text}
        </text>
      </motion.g>
    </>
  );
};

const SvgYAxis = ({
  yScale,
  x1,
  x2,
  tickCount,
}: {
  yScale: d3.ScaleLinear<number, number, never>;
  x1: number;
  x2: number;
  tickCount: number;
}) => {
  return (
    <>
      {yScale.ticks(tickCount).map((n: number) => (
        <g
          transform={`translate(0,${yScale(n)})`}
          className='text-[#e8f3fb]'
          key={n}
        >
          <line x1={x1} x2={x2} stroke='#e8f3fb40' strokeDasharray='3,3' />
          <text
            alignmentBaseline='middle'
            className='text-[.7rem]'
            fill='currentColor'
          >
            {n}
          </text>
        </g>
      ))}
    </>
  );
};

const SvgXAxis = ({
  months,
  xScale,
  y,
  yText,
}: {
  months: Date[];
  xScale: d3.ScaleTime<number, number, never>;
  y: number;
  yText: number;
}) => {
  return (
    <>
      {months.map((month, i) => (
        <g
          key={new Date(month).toISOString()}
          className='text-gray-800'
          transform={`translate(${xScale(month)},0)`}
        >
          {i % 2 === 1 && (
            <motion.rect
              animate={{ opacity: [0, 0.5], transition: { duration: i * 1 } }}
              width={xScale(endOfMonth(month)) - xScale(month)}
              height={y}
              fill='currentColor'
              className='text-[#e8f3fb]/10'
            />
          )}
          <motion.text
            initial={false}
            animate={{
              opacity: [0, 1],
              transition: { delay: 1, duration: 2 * (i + 1) },
            }}
            x={(xScale(endOfMonth(month)) - xScale(month)) / 2}
            y={yText}
            textAnchor='middle'
            fill='currentColor'
            className='text-[1rem] text-[#e8f3fb]'
          >
            {format(month, 'MMM')}
          </motion.text>
        </g>
      ))}
    </>
  );
};

const SvgWeekends = ({
  weekends,
  xScale,
  y,
  ht,
  color,
}: {
  weekends: Date[];
  xScale: d3.ScaleTime<number, number, never>;
  y: number;
  ht: number;
  color: string;
}) => {
  if (weekends.length < 2) return null;
  const daywd = Math.abs(
    xScale(weekends[0]) -
      xScale(new Date(weekends[0]).setDate(weekends[0].getDate() + 1))
  );
  console.log({ daywd, wl: weekends.length, ht });
  return (
    <motion.g animate={{ opacity: [0, 0.3], transition: { duration: 2 } }}>
      {weekends.map((dt) => (
        <rect
          key={dt.toString()}
          transform={`translate(${xScale(dt)},0)`}
          width={daywd}
          height={ht}
          fill={color}
        />
      ))}
    </motion.g>
  );
};
