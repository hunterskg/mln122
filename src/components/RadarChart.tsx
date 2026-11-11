'use client';

import React, { useEffect, useState } from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface RadarDataPoint {
  subject: string;
  score: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
}

export function DiagnosticRadarChart({ data }: RadarChartProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-stone-800 bg-stone-900/50">
        <span className="text-sm text-stone-500">Đang tải biểu đồ năng lực...</span>
      </div>
    );
  }

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#44403c" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: '#d6d3d1', fontSize: 11, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#78716c"
            tick={{ fill: '#a8a29e', fontSize: 10 }}
          />
          <Radar
            name="Tỷ lệ chuẩn xác (%)"
            dataKey="score"
            stroke="#e11d48"
            fill="#e11d48"
            fillOpacity={0.45}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1c1917',
              borderColor: '#44403c',
              borderRadius: '8px',
              color: '#f5f5f4',
              fontSize: '12px',
            }}
            formatter={(value: any) => [`${value}%`, 'Độ chuẩn xác']}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
