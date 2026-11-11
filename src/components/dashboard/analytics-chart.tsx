'use client';

import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { GameState } from '@/engine';
import { formatCurrency } from '@/lib/utils';

export function AnalyticsChart({ state }: { state: GameState }) {
  if (state.history.financials.length === 0) return null;

  const data = state.history.financials.map((h) => ({
    name: `Tháng ${h.turn}`,
    cash: h.endingCash,
    revenue: h.revenue,
    netIncome: h.netIncome,
  }));

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
      <h3 className="text-sm font-bold text-slate-200 mb-4">Biểu đồ diễn biến tài chính qua các kỳ</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCash" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
            <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `${Math.round(val / 1000)}k ₫`} />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value: any) => [formatCurrency(Number(value)), '']}
            />
            <Area type="monotone" dataKey="cash" name="Tiền mặt cuối kỳ" stroke="#10b981" fillOpacity={1} fill="url(#colorCash)" />
            <Area type="monotone" dataKey="revenue" name="Doanh thu" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
