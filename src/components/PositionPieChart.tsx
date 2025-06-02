import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export interface PositionDistribution {
  range: string;
  count: number;
}

interface Props {
  trades: {
    log_position: number;
  }[];
}

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c',
  '#d0ed57', '#8dd1e1', '#83a6ed', '#ffbb28', '#00C49F'
];

export function PositionPieChart({ trades }: Props) {
  const bins: PositionDistribution[] = Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 10}% - ${(i + 1) * 10}%`,
    count: 0
  }));

  trades.forEach(({ log_position }) => {
    const index = Math.min(Math.floor(log_position / 10), 9);
    bins[index].count++;
  });

  return (
    <div>
      <PieChart width={400} height={400}>
        <Pie
          data={bins}
          dataKey="count"
          nameKey="range"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {bins.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
