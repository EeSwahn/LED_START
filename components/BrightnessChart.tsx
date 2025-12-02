import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  ReferenceDot,
  Tooltip
} from 'recharts';

interface BrightnessChartProps {
  data: any[];
  currentTime: number; // 0 to 1
  dataKey: string;
  color: string;
}

export const BrightnessChart: React.FC<BrightnessChartProps> = ({ 
  data, 
  currentTime, 
  dataKey, 
  color 
}) => {
  // Find the point closest to current time for the reference dot
  const currentVal = data.find(d => Math.abs(d.t - currentTime) < 0.01)?.[dataKey] || 0;

  return (
    <div className="h-48 w-full bg-slate-800/50 rounded-lg p-2 border border-slate-700/50">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="t" 
            hide 
            type="number" 
            domain={[0, 1]} 
          />
          <YAxis 
            hide 
            domain={[0, 1]} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            itemStyle={{ color: '#cbd5e1' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => [`${(value * 100).toFixed(0)}%`, 'Brightness']}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={false}
          />
          <ReferenceDot 
            x={currentTime} 
            y={currentVal} 
            r={5} 
            fill="#fff" 
            stroke={color} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};