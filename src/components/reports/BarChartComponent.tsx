import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface BarChartComponentProps {
  data: any[];
  xAxisKey: string;
  barKey: string;
  barName: string;
}

export function BarChartComponent({
  data,
  xAxisKey,
  barKey,
  barName,
}: BarChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xAxisKey}
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
          tick={{ fontSize: 12 }}
          scale="band"
          padding={{ left: 10, right: 10 }}
          tickLine={true}
          axisLine={true}
          allowDataOverflow={false}
          hide={false}
          minTickGap={5}
          orientation="bottom"
          reversed={false}
          type="category"
        />
        <YAxis
          width={60}
          tick={{ fontSize: 12 }}
          allowDecimals={false}
          padding={{ top: 20 }}
          tickLine={true}
          axisLine={true}
          allowDataOverflow={false}
          hide={false}
          minTickGap={5}
          orientation="left"
          reversed={false}
          type="number"
          domain={[0, 'auto']}
        />
        <Tooltip 
          cursor={{ fillOpacity: 0.1 }}
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
          cursor={true}
          filterNull={true}
          offset={10}
          reverseDirection={false}
          shared={false}
          useTranslate3d={false}
          wrapperStyle={null}
        />
        <Legend 
          wrapperStyle={{ paddingTop: "20px" }}
          iconType="circle"
          align="center"
          verticalAlign="bottom"
          layout="horizontal"
          height={36}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        />
        <Bar 
          dataKey={barKey} 
          fill="#0088FE" 
          name={barName}
          radius={[4, 4, 0, 0]}
          maxBarSize={50}
          minPointSize={0}
          animationDuration={1000}
          animationBegin={0}
          animationEasing="ease"
          hide={false}
          isAnimationActive={true}
          legendType="circle"
          xAxisId={0}
          yAxisId={0}
          stackId={undefined}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}