import React, { useState } from 'react';
import { GameState, PlayerTurnActions } from '@/engine/types';
import { INDUSTRY_CONFIG } from '@/engine/config';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Plus, Trash2 } from 'lucide-react';

export function OperationsPanel({
  state,
  actions,
  onAddPO,
  onRemovePO,
}: {
  state: GameState;
  actions: PlayerTurnActions;
  onAddPO: (supId: string, units: number) => void;
  onRemovePO: (index: number) => void;
}) {
  const cfg = INDUSTRY_CONFIG[state.company.industry];
  const [selectedSupplier, setSelectedSupplier] = useState(cfg.suppliers[0]?.id || '');
  const [orderUnits, setOrderUnits] = useState(100);

  const handleOrder = () => {
    if (!selectedSupplier || orderUnits <= 0) return;
    onAddPO(selectedSupplier, orderUnits);
  };

  const totalStock = state.inventory.lots.reduce((acc, lot) => acc + lot.units, 0);

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-slate-200">Chuỗi Cung ứng & Quản trị Hàng tồn kho</h3>
        <span className="text-xs text-slate-400">
          Tổng tồn kho khả dụng: <strong className="text-slate-100">{formatNumber(totalStock)}</strong> đơn vị
        </span>
      </div>

      {/* Place Purchase Order */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded">
        <div className="text-xs font-semibold text-slate-300 mb-2">Đặt hàng bổ sung từ Nhà cung cấp</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Chọn nhà cung cấp</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-1.5 focus:outline-none focus:border-emerald-500"
            >
              {cfg.suppliers.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name} ({formatCurrency(sup.unitCost)}/đv, Giao: {sup.leadTimeMonths} tháng, {sup.paymentTerms === 'immediate' ? 'Trả ngay' : 'Net-30'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Số lượng đặt hàng</label>
            <input
              type="number"
              min="10"
              step="10"
              value={orderUnits}
              onChange={(e) => setOrderUnits(Math.max(10, parseInt(e.target.value) || 0))}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded p-1.5 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={handleOrder}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs py-2 px-3 rounded flex items-center justify-center gap-1 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Đưa vào đơn chờ
            </button>
          </div>
        </div>
      </div>

      {/* Queued Orders for this turn */}
      {actions.purchaseOrders.length > 0 && (
        <div className="text-xs">
          <span className="font-semibold text-slate-300">Đơn hàng sẽ phát lệnh vào cuối tháng:</span>
          <div className="mt-1 space-y-1">
            {actions.purchaseOrders.map((po, index) => {
              const sup = cfg.suppliers.find((s) => s.id === po.supplierId);
              return (
                <div key={index} className="flex justify-between items-center bg-slate-800/60 p-2 rounded">
                  <span>
                    {formatNumber(po.units)} đơn vị từ <strong>{sup?.name}</strong> ({formatCurrency(po.units * (sup?.unitCost || 0))})
                  </span>
                  <button onClick={() => onRemovePO(index)} className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pending Delivery Pipeline */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 mb-1.5">Lô hàng đang vận chuyển</h4>
        {state.inventory.purchaseOrders.length === 0 ? (
          <div className="text-xs text-slate-500 italic">Hiện không có lô hàng nào đang trên đường về kho.</div>
        ) : (
          <div className="space-y-1">
            {state.inventory.purchaseOrders.map((po) => (
              <div key={po.id} className="text-xs bg-slate-950 p-2 rounded border border-slate-800 flex justify-between">
                <span>{formatNumber(po.units)} đơn vị (từ {po.supplierId})</span>
                <span className="text-indigo-400">Về kho sau {po.deliveryTurn - state.turn} tháng nữa</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
