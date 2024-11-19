import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300'
];

interface PieChartComponentProps {
  data: Array<{ name: string; value: number }>;
}

export function PieChartComponent({ data }: PieChartComponentProps) {
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null;

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={100}
          innerRadius={0}
          paddingAngle={2}
          dataKey="value"
          animationDuration={1000}
          animationBegin={0}
          animationEasing="ease"
          blendStroke={true}
          cornerRadius={0}
          endAngle={360}
          hide={false}
          isAnimationActive={true}
          legendType="circle"
          minAngle={0}
          nameKey="name"
          startAngle={0}
        >
          {data.map((_, index) => (
            <Cell 
              key={`cell-${index}`} 
              fill={COLORS[index % COLORS.length]}
              stroke="#fff"
              strokeWidth={1}
            />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [
            `${value} (${((value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%)`,
            ''
          ]}
          contentStyle={{ 
            backgroundColor: 'white',
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '8px'
          }}
          active={true}
          allowEscapeViewBox={{ x: false, y: false }}
          animationDuration={200}
          animationEasing="ease-out"
          coordinate={{ x: 0, y: 0 }}
          filterNull={true}
          offset={10}
          reverseDirection={false}
          shared={false}
          useTranslate3d={false}
          wrapperStyle={null}
        />
        <Legend 
          layout="horizontal" 
          verticalAlign="bottom" 
          align="center"
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="circle"
          height={36}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}