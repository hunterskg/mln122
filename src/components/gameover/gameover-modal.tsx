import React, { useEffect } from 'react';
import { GameState } from '@/engine/types';
import { formatCurrency, formatNumber } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

export function GameOverModal({ state, onReset }: { state: GameState; onReset: () => void }) {
  const isVictory = state.gameEnding && state.gameEnding !== 'bankruptcy';

  useEffect(() => {
    if (isVictory) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  }, [isVictory]);

  const titles = {
    bankruptcy: 'Mất khả năng thanh toán & Phá sản',
    sustainable_exit: 'Doanh nghiệp Phát triển Bền vững',
    acquisition: 'Sáp nhập Doanh nghiệp Chiến lược',
    unicorn: 'Kỳ lân Công nghệ & Niêm yết Đại chúng (IPO)',
    max_turns: 'Hoàn thành Cột mốc 36 Tháng',
  };

  const descriptions = {
    bankruptcy: 'Tiền mặt cạn kiệt và âm kéo dài nhiều tháng liên tiếp. Doanh nghiệp buộc phải dừng hoạt động và thanh lý tài sản.',
    sustainable_exit: 'Bạn đã xây dựng thành công một doanh nghiệp dòng tiền dương, có sức đề kháng cao suốt 36 tháng hoạt động.',
    acquisition: 'Được một tập đoàn đầu ngành mua lại với mức định giá hấp dẫn nhờ vị thế thương hiệu vững chắc.',
    unicorn: 'Doanh nghiệp đạt tốc độ tăng trưởng phi thường và hoàn tất niêm yết cổ phiếu thành công trên sàn chứng khoán.',
    max_turns: 'Hoàn thành 36 tháng vận hành kinh doanh đầy bản lĩnh.',
  };

  const totalRev = state.history.financials.reduce((sum, h) => sum + h.revenue, 0);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-xl p-6 shadow-2xl text-center space-y-4">
        <h2 className={`text-2xl font-black ${isVictory ? 'text-emerald-400' : 'text-rose-500'}`}>
          {titles[state.gameEnding || 'bankruptcy']}
        </h2>
        <p className="text-sm text-slate-300">{descriptions[state.gameEnding || 'bankruptcy']}</p>

        {/* Final Report Card */}
        <div className="bg-slate-950 border border-slate-800 rounded-lg p-4 text-xs text-left space-y-2">
          <div className="font-bold text-slate-200 border-b border-slate-800 pb-1">Bảng điểm Tổng kết Hoạt động</div>
          <div className="flex justify-between">
            <span className="text-slate-400">Tổng doanh thu lũy kế:</span>
            <span className="font-semibold text-slate-100">{formatCurrency(totalRev)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Số dư tiền mặt cuối kỳ:</span>
            <span className={`font-semibold ${state.financial.cash >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
              {formatCurrency(state.financial.cash)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Quy mô đội ngũ nhân sự:</span>
            <span className="font-semibold text-slate-100">{state.employees.length} nhân sự</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Uy tín thương hiệu trên thị trường:</span>
            <span className="font-semibold text-slate-100">{state.market.reputation} / 100</span>
          </div>
        </div>

        <button
          onClick={onReset}
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Bắt đầu ván chơi mới từ đầu</span>
        </button>

        <div className="pt-2 text-center text-xs text-slate-400">
          Made by <span className="text-amber-300 font-semibold">Group 4</span>
        </div>
      </div>
    </div>
  );
}
