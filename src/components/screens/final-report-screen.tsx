import React, { useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ACHIEVEMENTS } from '@/engine';
import { formatCurrency, formatNumber } from '@/lib/utils';
import confetti from 'canvas-confetti';
import { FileCheck2, Award, RotateCcw, ShieldAlert } from 'lucide-react';

export function FinalReportScreen() {
  const { gameState, resetGame } = useGameStore();
  const { setActiveScreen } = useUIStore();

  if (!gameState) return null;

  const totalRev = gameState.history.financials.reduce((sum, h) => sum + h.revenue, 0);
  const totalNetIncome = gameState.history.financials.reduce((sum, h) => sum + h.netIncome, 0);
  const totalOpex = gameState.history.financials.reduce((sum, h) => sum + h.opex, 0);
  const isConcluded = gameState.isGameOver || gameState.turn >= 36;
  const isVictory = gameState.gameEnding && gameState.gameEnding !== 'bankruptcy';

  useEffect(() => {
    if (isVictory) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
    }
  }, [isVictory]);

  const valuation = Math.max(0, Math.round(totalRev * 1.5 + gameState.financial.cash));
  const unlockedAchievements = ACHIEVEMENTS.filter((a) => a.check(gameState));

  const endingHeaders: Record<string, { title: string; desc: string }> = {
    bankruptcy: {
      title: 'Tuyên bố Phá sản & Thanh lý Doanh nghiệp',
      desc: 'Công ty cạn kiệt thanh khoản tiền mặt kéo dài, buộc phải phát mại tài sản thanh toán nợ cho chủ nợ.',
    },
    sustainable_exit: {
      title: 'Doanh nghiệp Phát triển Bền vững',
      desc: 'Bạn đã xây dựng thành công một doanh nghiệp độc lập tài chính, sinh lời ổn định trọn vẹn chu kỳ 36 tháng.',
    },
    acquisition: {
      title: 'Được Tập đoàn Mua lại & Sáp nhập Chiến lược',
      desc: 'Được một tập đoàn đa quốc gia mua lại với mức định giá doanh nghiệp hấp dẫn dựa trên năng lực thương hiệu.',
    },
    unicorn: {
      title: 'Kỳ lân Công nghệ & Niêm yết Đại chúng (IPO)',
      desc: 'Kỳ tích tăng trưởng vượt bậc! Hoàn tất niêm yết cổ phiếu lần đầu ra công chúng trên thị trường chứng khoán.',
    },
    max_turns: {
      title: 'Hoàn thành Cột mốc 36 Tháng Điều hành',
      desc: 'Hoàn thành trọn vẹn hành trình 3 năm khởi sự kinh doanh đầy bản lĩnh.',
    },
  };

  const endingInfo = endingHeaders[gameState.gameEnding || (isConcluded ? 'sustainable_exit' : 'max_turns')];

  const industryNames: Record<string, string> = {
    coffee: 'Cà phê thủ công',
    apparel: 'Thời trang May mặc',
    saas: 'Phần mềm B2B (SaaS)',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className={isVictory ? 'border-emerald-500/40 bg-emerald-950/10' : 'border-slate-800'}>
        <CardHeader className="border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className={`w-6 h-6 ${isVictory ? 'text-emerald-400' : 'text-slate-400'}`} />
            <div>
              <h2 className="text-lg font-black text-slate-100">{gameState.company?.name || 'Công ty'} — Báo cáo Tổng kết Hoạt động</h2>
              <p className="text-xs text-slate-400">
                {industryNames[gameState.company?.industry || ''] || gameState.company?.industry} · Mô hình: {gameState.company?.businessModel.toUpperCase()}
              </p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-slate-300">
            {isConcluded ? 'Kết thúc chu kỳ 36 tháng' : `Kiểm toán tạm thời Tháng ${gameState.turn}`}
          </span>
        </CardHeader>

        <CardContent className="space-y-6 pt-4">
          {/* Ending Status Banner */}
          {gameState.isGameOver && (
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 ${
                isVictory
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-rose-950/30 border-rose-500/50 text-rose-200'
              }`}
            >
              {isVictory ? <Award className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" /> : <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />}
              <div>
                <div className="font-bold text-sm">{endingInfo.title}</div>
                <div className="text-xs opacity-90 mt-0.5">{endingInfo.desc}</div>
              </div>
            </div>
          )}

          {/* Corporate Valuation Highlight */}
          <div className="p-5 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-1">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Định giá Doanh nghiệp Cuối kỳ</div>
            <div className="text-4xl font-black text-emerald-400">{formatCurrency(valuation)}</div>
            <p className="text-xs text-slate-400">Hệ số 1,5x Doanh thu lũy kế + Số dư tiền mặt thanh khoản ròng</p>
          </div>

          {/* Comprehensive Financial Scorecard */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Tổng doanh thu lũy kế</span>
              <span className="font-bold text-sm text-slate-100">{formatCurrency(totalRev)}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Tổng chi phí hoạt động</span>
              <span className="font-bold text-sm text-slate-100">{formatCurrency(totalOpex)}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Lợi nhuận ròng tích lũy</span>
              <span className={`font-bold text-sm ${totalNetIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(totalNetIncome)}
              </span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Tiền mặt tồn quỹ cuối kỳ</span>
              <span className={`font-bold text-sm ${gameState.financial.cash >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {formatCurrency(gameState.financial.cash)}
              </span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Dư nợ tín dụng cuối kỳ</span>
              <span className="font-bold text-sm text-slate-100">{formatCurrency(gameState.financial.debt)}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Tệp khách hàng duy trì</span>
              <span className="font-bold text-sm text-indigo-400">{formatNumber(gameState.market.activeCustomers)}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Mức độ thỏa mãn khách hàng</span>
              <span className="font-bold text-sm text-emerald-400">{gameState.market.customerSatisfaction}%</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block">Thời gian vận hành đạt được</span>
              <span className="font-bold text-sm text-slate-100">{gameState.turn - 1} / 36 Tháng</span>
            </div>
          </div>

          {/* Unlocked Achievements & Milestones List */}
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Huy hiệu Thành tựu Doanh nghiệp ({unlockedAchievements.length} / {ACHIEVEMENTS.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = a.check(gameState);
                return (
                  <div
                    key={a.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between ${
                      unlocked ? 'bg-amber-950/20 border-amber-800/60 text-slate-200' : 'bg-slate-950/30 border-slate-900 text-slate-500 opacity-50'
                    }`}
                  >
                    <div>
                      <div className="font-semibold">{a.name}</div>
                      <div className="text-[10px] text-slate-400">{a.description}</div>
                    </div>
                    <span className="text-[10px] font-bold uppercase">{unlocked ? '✓ Đã đạt' : 'Chưa đạt'}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              size="md"
              onClick={() => setActiveScreen('history')}
              className="w-full sm:w-1/2"
            >
              Kiểm toán toàn bộ Sổ cái Kế toán
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                if (window.confirm('Khởi sự thành lập một công ty mới từ đầu?')) {
                  resetGame();
                  setActiveScreen('setup');
                }
              }}
              className="w-full sm:w-1/2"
            >
              <RotateCcw className="w-4 h-4" /> Bắt đầu hành trình khởi nghiệp mới
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
