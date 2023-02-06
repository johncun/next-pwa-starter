import { format } from 'date-fns';

export const DateTick = (props: any) => {
  const { x, y, payload, angle } = props;

  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        textAnchor='end'
        fill='#666'
        transform={`rotate(${angle}) scale(0.5)`}
      >
        {format(new Date(payload.value), 'eee dd-MMM')}
      </text>
    </g>
  );
};
