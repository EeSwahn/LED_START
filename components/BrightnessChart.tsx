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
  activeKey: string;
  activeColor: string;
}

export const BrightnessChart: React.FC<BrightnessChartProps> = ({ 
  data, 
  currentTime, 
  activeKey, 
  activeColor 
}) => {
  // Find the point closest to current time for the reference dot
  const currentVal = data.find(d => Math.abs(d.t - currentTime) < 0.01)?.[activeKey] || 0;

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="t" 
            type="number" 
            domain={[0, 1]} 
            tick={{ fill: '#475569', fontSize: 10 }}
            tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
          />
          <YAxis 
            domain={[0, 1]} 
            tick={{ fill: '#475569', fontSize: 10 }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px' }}
            itemStyle={{ padding: 0 }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number, name: string) => {
                if (name !== activeKey) return []; // Hide inactive from tooltip
                return [`${(value * 100).toFixed(1)}%`, 'Brightness'];
            }}
          />
          
          {/* Ghost Lines (Background Context) */}
          <Line type="monotone" dataKey="linear" stroke="#334155" strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="sCurve" stroke="#334155" strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="logarithmic" stroke="#334155" strokeWidth={1} strokeDasharray="4 4" dot={false} isAnimationActive={false} />

          {/* Active Line */}
          <Line 
            type="monotone" 
            dataKey={activeKey} 
            stroke={activeColor} 
            strokeWidth={3} 
            dot={false} 
            isAnimationActive={false}
          />
          
          {/* Indicator Dot */}
          <ReferenceDot 
            x={currentTime} 
            y={currentVal} 
            r={6} 
            fill="#0f172a"
            stroke={activeColor} 
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};