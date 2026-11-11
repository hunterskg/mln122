import React from 'react';
import { GameState, PlayerTurnActions } from '@/engine';
import { calculateCustomerDynamicsAndDemand, calculateLaborCapacity } from '@/engine';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';

export function MarketPanel({
  state,
  actions,
  onSetPrice,
  onSetMarketing,
}: {
  state: GameState;
  actions: PlayerTurnActions;
  onSetPrice: (val: number) => void;
  onSetMarketing: (val: number) => void;
}) {
  const customerSim = calculateCustomerDynamicsAndDemand(
    {
      ...state.market,
      unitPrice: actions.unitPrice,
      marketingBudget: actions.marketingBudget,
    },
    actions.unitPrice,
    actions.marketingBudget,
    state.employees,
    state.company.founderTrait,
    state.company.industry,
    state.lastReport?.stockoutUnits || 0
  );

  const capacity = calculateLaborCapacity(state);

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-5">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-slate-200">Định giá Hàng hóa & Chiến lược Tiếp thị Lưu thông</h3>
        <span className="text-xs text-slate-400">
          Ngành hàng: <strong className="text-slate-200">{state.company.industry === 'coffee' ? 'Cà phê' : state.company.industry === 'apparel' ? 'Thời trang' : 'SaaS'}</strong>
        </span>
      </div>

      {/* Pricing Slider */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-300 font-semibold">Đơn giá bán sản phẩm (Giá cả biểu hiện của giá trị)</span>
          <span className="text-emerald-400 font-bold text-base">{formatCurrency(actions.unitPrice)}</span>
        </div>
        <input
          type="range"
          min="5"
          max={state.market.competitorPrice * 2.5}
          step="1"
          value={actions.unitPrice}
          onChange={(e) => onSetPrice(Number(e.target.value))}
          className="w-full accent-emerald-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
          <span>Giá bình quân đối thủ: {formatCurrency(state.market.competitorPrice)}</span>
          <span className={actions.unitPrice > state.market.competitorPrice ? 'text-amber-400' : 'text-emerald-400'}>
            {actions.unitPrice > state.market.competitorPrice ? 'Định giá cao cấp (Biên lãi cao, cầu giảm)' : 'Định giá cạnh tranh (Biên lãi mỏng, cầu tăng)'}
          </span>
        </div>
      </div>

      {/* Marketing Budget Slider */}
      <div>
        <div className="flex justify-between items-center text-xs mb-1">
          <span className="text-slate-300 font-semibold">Ngân sách tiếp thị & quảng bá hàng tháng</span>
          <span className="text-blue-400 font-bold text-base">{formatCurrency(actions.marketingBudget)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="8000"
          step="100"
          value={actions.marketingBudget}
          onChange={(e) => onSetMarketing(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-slate-500 mt-0.5">
          <span>Chi phí lưu thông thuần túy có hiệu suất biên giảm dần</span>
          <span>Khách hàng mới ước tính: ~{formatNumber(customerSim.newCustomers)} khách</span>
        </div>
      </div>

      {/* Dynamic Projections Matrix */}
      <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2">
        <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-slate-400">Dự phóng Nhu cầu Thị trường (Cầu):</span>
          <span className="font-bold text-slate-100">{formatNumber(customerSim.totalDemand)} đơn vị</span>
        </div>
        <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-slate-400">Trần Năng lực Sản xuất của Lao động:</span>
          <span className="font-bold text-slate-100">{formatNumber(capacity)} đơn vị/tháng</span>
        </div>
        <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
          <span className="text-slate-400">Dự phóng Mức độ Thỏa mãn Khách hàng:</span>
          <span
            className={`font-bold ${
              customerSim.satisfaction >= 75 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {customerSim.satisfaction} / 100
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Khách hàng dự kiến rời bỏ mỗi tháng:</span>
          <span className="font-mono text-rose-400">-{formatNumber(customerSim.churnedCustomers)} khách hàng</span>
        </div>

        {customerSim.totalDemand > capacity && (
          <div className="text-[11px] text-amber-400 pt-1 border-t border-slate-800 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>Nhu cầu vượt quá năng lực sản xuất của đội ngũ. Cần tuyển thêm nhân sự Vận hành để tránh cháy hàng.</span>
          </div>
        )}
      </div>
    </div>
  );
}
