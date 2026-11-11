import React from 'react';
import { useGameStore } from '@/store/game-store';
import { MarketPanel } from '@/components/market/pricing-panel';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function MarketOverviewScreen() {
  const { gameState, currentActions, setUnitPrice, setMarketingBudget } = useGameStore();

  if (!gameState) return null;

  return (
    <div className="space-y-6">
      {/* Market & Customer Benchmark Header */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Quy mô thị trường</div>
          <div className="text-xl font-black text-slate-100 mt-1">
            {formatNumber(gameState.market.marketSize)} đv
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">+{(gameState.market.marketTrend * 100).toFixed(0)}% tăng trưởng/tháng</div>
        </Card>

        <Card className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Giá đối thủ cạnh tranh</div>
          <div className="text-xl font-black text-slate-100 mt-1">{formatCurrency(gameState.market.competitorPrice)}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Giá bình quân trên thị trường</div>
        </Card>

        <Card className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Uy tín thương hiệu</div>
          <div className="text-xl font-black text-amber-400 mt-1">{gameState.market.reputation} / 100</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Chỉ số niềm tin xã hội</div>
        </Card>

        <Card className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Khách hàng hoạt động</div>
          <div className="text-xl font-black text-indigo-400 mt-1">
            {formatNumber(gameState.market.activeCustomers)}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Tệp khách hàng duy trì</div>
        </Card>

        <Card className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Mức độ thỏa mãn</div>
          <div className="text-xl font-black text-emerald-400 mt-1">
            {gameState.market.customerSatisfaction}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Giá trị sử dụng đáp ứng kỳ vọng</div>
        </Card>

        <Card className="p-3.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Tỷ lệ rời bỏ (Churn)</div>
          <div className="text-xl font-black text-rose-400 mt-1">
            {(gameState.market.churnRate * 100).toFixed(1)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Khách hàng mất đi mỗi tháng</div>
        </Card>
      </div>

      {/* Pricing & Go-To-Market Controls */}
      <MarketPanel
        state={gameState}
        actions={currentActions}
        onSetPrice={setUnitPrice}
        onSetMarketing={setMarketingBudget}
      />
    </div>
  );
}
