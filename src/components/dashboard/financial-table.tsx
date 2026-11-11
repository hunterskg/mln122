import React from 'react';
import { GameState } from '@/engine/types';
import { formatCurrency } from '@/lib/utils';

export function FinancialTable({ state }: { state: GameState }) {
  const fin = state.history.financials[state.history.financials.length - 1];

  if (!fin) {
    return (
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 text-center text-sm">
        Tiến hành kết thúc Tháng 1 để xem báo cáo tài chính đầu tiên.
      </div>
    );
  }

  const netCashFlow = fin.cashReceipts - fin.cashDisbursements;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* P&L */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3 flex justify-between">
          <span>Báo cáo Kết quả Kinh doanh (Dồn tích)</span>
          <span className="text-xs text-slate-400 font-normal">Tháng {fin.turn}</span>
        </h3>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Doanh thu gộp</span>
            <span className="font-semibold text-slate-200">{formatCurrency(fin.revenue)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Giá vốn hàng bán (FIFO - c)</span>
            <span className="text-rose-400">-{formatCurrency(fin.cogs)}</span>
          </div>
          <div className="flex justify-between py-1 font-semibold text-slate-100">
            <span>Lợi nhuận gộp</span>
            <span>{formatCurrency(fin.grossProfit)}</span>
          </div>
          <div className="flex justify-between py-1 pl-2 text-slate-400">
            <span>Tiền lương nhân sự (v)</span>
            <span className="text-rose-400">-{formatCurrency(fin.salaries)}</span>
          </div>
          <div className="flex justify-between py-1 pl-2 text-slate-400">
            <span>Tiền thuê mặt bằng cơ sở</span>
            <span className="text-rose-400">-{formatCurrency(fin.rent)}</span>
          </div>
          <div className="flex justify-between py-1 pl-2 text-slate-400">
            <span>Chi phí tiếp thị & quảng bá</span>
            <span className="text-rose-400">-{formatCurrency(fin.marketing)}</span>
          </div>
          <div className="flex justify-between py-1 pl-2 text-slate-400 border-b border-slate-800/60">
            <span>Chi phí lãi vay tư bản</span>
            <span className="text-rose-400">-{formatCurrency(fin.interest)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-400">
            <span>Thuế thu nhập doanh nghiệp (20%)</span>
            <span className="text-rose-400">-{formatCurrency(fin.tax)}</span>
          </div>
          <div className="flex justify-between py-1.5 font-bold border-t border-slate-700 text-sm">
            <span>Lợi nhuận ròng</span>
            <span className={fin.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {formatCurrency(fin.netIncome)}
            </span>
          </div>
        </div>
      </div>

      {/* Cash Flow */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg">
        <h3 className="text-sm font-bold text-slate-200 border-b border-slate-800 pb-2 mb-3 flex justify-between">
          <span>Báo cáo Lưu chuyển Tiền tệ (Dòng tiền)</span>
          <span className="text-xs text-slate-400 font-normal">Tháng {fin.turn}</span>
        </h3>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Số dư tiền mặt đầu kỳ</span>
            <span className="text-slate-300">{formatCurrency(fin.startingCash)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Dòng tiền thu vào (Bán tiền mặt + Thu nợ)</span>
            <span className="text-emerald-400">+{formatCurrency(fin.cashReceipts)}</span>
          </div>
          <div className="flex justify-between py-1 text-slate-400">
            <span>Dòng tiền chi ra (Chi phí hoạt động, Trả nợ, Mua hàng)</span>
            <span className="text-rose-400">-{formatCurrency(fin.cashDisbursements)}</span>
          </div>
          <div className="flex justify-between py-1 font-semibold text-slate-200 border-b border-slate-800/60">
            <span>Lưu chuyển tiền tệ ròng trong tháng</span>
            <span className={netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
              {netCashFlow >= 0 ? '+' : ''}{formatCurrency(netCashFlow)}
            </span>
          </div>
          <div className="flex justify-between py-1.5 font-bold border-t border-slate-700 text-sm">
            <span>Số dư tiền mặt cuối kỳ</span>
            <span className={fin.endingCash >= 0 ? 'text-emerald-400' : 'text-rose-500'}>
              {formatCurrency(fin.endingCash)}
            </span>
          </div>

          <div className="mt-4 pt-2 border-t border-slate-800 flex justify-between text-slate-400 text-[11px]">
            <span>Khoản phải thu chờ về: {formatCurrency(fin.accountsReceivable)}</span>
            <span>Khoản phải trả nhà cung cấp: {formatCurrency(fin.accountsPayable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
