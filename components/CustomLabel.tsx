export const CustomLabel = (props: any) => {
  const { x, y, stroke, value } = props;

  return (
    <svg>
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dx={20}
          dy={3}
          fill={'white'}
          fontStyle={1200}
          fontSize={8}
          transform={`rotate(-90) scale(1.2)`}
          textAnchor='left'
        >
          {value}
        </text>
      </g>
    </svg>
  );
};
