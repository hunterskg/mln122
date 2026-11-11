import React from 'react';
import { DollarSign, TrendingUp, Package, Users, ShieldAlert, Award } from 'lucide-react';
import { GameState } from '@/engine';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function KpiCards({ state }: { state: GameState }) {
  const latestFin = state.history.financials[state.history.financials.length - 1];
  const monthlyBurn = latestFin ? Math.max(0, latestFin.cashDisbursements - latestFin.cashReceipts) : 0;
  const runwayMonths = monthlyBurn > 0 ? (state.financial.cash / monthlyBurn).toFixed(1) : '∞';
  const totalStock = state.inventory.lots.reduce((acc, lot) => acc + lot.units, 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {/* Cash */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Tiền mặt khả dụng</span>
          <DollarSign className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2">
          <div className={`text-xl font-bold ${state.financial.cash < 0 ? 'text-rose-500' : 'text-slate-100'}`}>
            {formatCurrency(state.financial.cash)}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Duy trì: {runwayMonths} tháng</div>
        </div>
      </div>

      {/* Net Income */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Lợi nhuận ròng</span>
          <TrendingUp className="w-4 h-4 text-blue-400" />
        </div>
        <div className="mt-2">
          <div
            className={`text-xl font-bold ${
              latestFin?.netIncome && latestFin.netIncome < 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}
          >
            {latestFin ? formatCurrency(latestFin.netIncome) : '0 ₫'}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            Doanh thu: {latestFin ? formatCurrency(latestFin.revenue) : '0 ₫'}
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Hàng tồn kho</span>
          <Package className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-100">{formatNumber(totalStock)} sản phẩm</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {latestFin ? formatCurrency(latestFin.inventoryValuation) : '0 ₫'} (FIFO)
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Lực lượng lao động</span>
          <Users className="w-4 h-4 text-indigo-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-100">{state.employees.length} Nhân sự</div>
          <div className="text-xs text-slate-400 mt-0.5">
            Tinh thần:{' '}
            {Math.round(
              state.employees.reduce((acc, e) => acc + e.morale, 0) / Math.max(1, state.employees.length)
            )}
            %
          </div>
        </div>
      </div>

      {/* Debt */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Dư nợ tín dụng</span>
          <ShieldAlert className="w-4 h-4 text-red-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-100">{formatCurrency(state.financial.debt)}</div>
          <div className="text-xs text-slate-400 mt-0.5">Hạn mức: {formatCurrency(state.financial.creditLimit)}</div>
        </div>
      </div>

      {/* Reputation */}
      <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-lg flex flex-col justify-between">
        <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
          <span>Uy tín thương hiệu</span>
          <Award className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="mt-2">
          <div className="text-xl font-bold text-slate-100">{state.market.reputation} / 100</div>
          <div className="text-xs text-slate-400 mt-0.5">Thị phần ngành: ~{state.market.marketShare}%</div>
        </div>
      </div>
    </div>
  );
}
