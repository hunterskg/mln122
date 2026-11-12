import React, { useMemo } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { evaluateReflection } from '@/engine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  RotateCcw,
  BookOpen,
  HelpCircle,
  History as HistoryIcon,
  Home,
  Heart,
  Brain,
  Users,
  Wallet,
  ScrollText,
} from 'lucide-react';

export function FinalReportScreen() {
  const { lifeState, resetLife, gameState, resetGame } = useGameStore();
  const { setActiveScreen } = useUIStore();

  // Life Reflection Report (Priority)
  const reflectionReport = useMemo(() => {
    if (!lifeState) return null;
    return evaluateReflection(lifeState);
  }, [lifeState]);

  if (lifeState && reflectionReport) {
    const p = lifeState.profile;
    const s = lifeState.stats;

    const xuatThanNameMap: Record<string, string> = {
      nong_thon_ngheo: 'Nông thôn thuần nông',
      lao_dong_do_thi: 'Lao động đô thị',
      tieu_tu_san: 'Hộ buôn bán nhỏ',
      tri_thuc_tinh_hoa: 'Trí thức tinh hoa',
      doanh_nhan_thanh_dat: 'Gia đình doanh nhân',
    };
    const xuatThanText = xuatThanNameMap[p.xuatThan] || 'Lao động tự do';

    return (
      <div className="max-w-4xl mx-auto space-y-6 py-6 px-4 sm:px-6">
        {/* Main Title Banner */}
        <Card className="bg-paper-2 border-rule shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <CardHeader className="border-b border-rule-subtle pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 shrink-0">
                  <ScrollText className="w-6 h-6" />
                </span>
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-muted block">
                    Nhìn lại kiếp nhân sinh
                  </span>
                  <CardTitle className="text-2xl sm:text-3xl font-normal font-display text-ink">
                    {reflectionReport.tieuDeCuocDoi}
                  </CardTitle>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-paper border border-rule-subtle text-xs text-ink-2 font-medium self-start sm:self-auto whitespace-nowrap">
                Hưởng thọ: <span className="font-bold text-amber-300 font-mono">{p.tuoi} tuổi</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-5">
            {/* Conclusion Reason Banner */}
            <div className="p-4 bg-paper rounded-xl border border-rule-subtle text-xs text-ink-2 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted block">
                Khép lại chặng đường:
              </span>
              <p className="text-sm font-semibold text-ink">
                {lifeState.lyDoKetThuc || 'Hoàn thành trọn vẹn cuộc đời'}
              </p>
              <p className="text-[11px] text-muted">
                Xuất phát từ {p.diaPhuong} ({xuatThanText}), trải qua {lifeState.history.length} cột mốc thăng trầm.
              </p>
            </div>

            {/* Final Legacy Numbers */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-paper rounded-lg border border-rule-subtle">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Của cải còn lại</span>
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-emerald-300">
                  {formatCurrency(s.tienMat)}
                </div>
              </div>

              <div className="p-3 bg-paper rounded-lg border border-rule-subtle">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sức khỏe cuối đời</span>
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-ink">
                  {s.sucKhoe} / 100
                </div>
              </div>

              <div className="p-3 bg-paper rounded-lg border border-rule-subtle">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Bình an tinh thần</span>
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-indigo-300">
                  {s.tinhThan} / 100
                </div>
              </div>

              <div className="p-3 bg-paper rounded-lg border border-rule-subtle">
                <div className="flex items-center gap-1.5 text-muted mb-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Tình cảm thân tộc</span>
                </div>
                <div className="text-sm font-bold font-mono tabular-nums text-sky-300">
                  {s.quanHe} / 100
                </div>
              </div>
            </div>

            {/* Key Life Patterns (Mo thuc chinh) */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Những lát cắt nhân sinh nổi bật</span>
              </div>

              <div className="space-y-3">
                {reflectionReport.moThucChinh.map((pat, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-paper rounded-xl border border-rule-subtle space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="font-bold text-sm text-amber-300">{pat.ten.normalize('NFC')}</span>
                      <span className="text-[11px] text-muted font-mono italic">
                        {pat.moTaNgan.normalize('NFC')}
                      </span>
                    </div>
                    <p className="text-[13px] text-ink-2 leading-relaxed font-body">
                      {pat.doanNhinLai.normalize('NFC')}
                    </p>
                    <div className="pt-2 border-t border-rule-subtle/60 space-y-1">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-[10px] font-medium font-body">
                        <BookOpen className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span>{pat.chuongGiaoTrinh.normalize('NFC')}</span>
                      </span>
                      <p className="text-[12px] text-muted italic leading-relaxed font-body">
                        {pat.luanDiemGiaoTrinh.normalize('NFC')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reflective Open Question */}
            <div className="p-4 rounded-xl border border-sky-800/40 bg-sky-950/20 space-y-2">
              <div className="flex items-center gap-2 text-sky-300 font-bold text-xs uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 shrink-0" />
                <span>Câu hỏi mở để chiêm nghiệm</span>
              </div>
              <p className="text-sm text-ink italic font-body leading-relaxed">
                "{reflectionReport.cauHoiMo}"
              </p>
            </div>

            {/* Political Economy Lens */}
            <div className="p-4 rounded-xl border border-indigo-900/40 bg-paper space-y-2 text-xs">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold uppercase tracking-wider text-[11px]">
                <BookOpen className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Đối chiếu Giáo trình Kinh tế chính trị Mác - Lênin (Bộ GD&ĐT)</span>
              </div>
              <p className="text-ink-2 leading-relaxed text-[13px] whitespace-pre-line font-body">
                {reflectionReport.gocKinhTeChinhTri.normalize('NFC')}
              </p>
            </div>

            {/* Timeline of Decisions */}
            {lifeState.history.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                  <HistoryIcon className="w-4 h-4 text-muted" />
                  <span>Dòng thời gian các lựa chọn sinh kế</span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {lifeState.history.map((h, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-paper rounded-lg border border-rule-subtle text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1"
                    >
                      <div>
                        <span className="font-semibold text-ink">{h.tuoi} tuổi: </span>
                        <span className="text-muted">{h.tieuDeCanh} — </span>
                        <span className="text-emerald-300 font-medium">"{h.vanBanLuaChon}"</span>
                      </div>
                      {h.ghiChuHauQua && (
                        <span className="text-muted italic shrink-0 text-[10px]">
                          {h.ghiChuHauQua}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Navigation Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-rule-subtle">
              <Button
                variant="outline"
                size="md"
                onClick={() => setActiveScreen('menu')}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 border-rule text-ink hover:border-accent whitespace-nowrap"
              >
                <Home className="w-4 h-4" />
                <span>Về Menu chính</span>
              </Button>

              <Button
                variant="primary"
                size="md"
                onClick={() => {
                  resetLife();
                  setActiveScreen('setup');
                }}
                className="w-full sm:w-1/2 flex items-center justify-center gap-2 font-bold bg-amber-500 hover:bg-amber-400 text-black border-none whitespace-nowrap"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Bốc một cuộc đời mới</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Legacy fallback if user is in enterprise mode
  if (!gameState) return null;

  return (
    <div className="max-w-2xl mx-auto py-12 text-center space-y-4">
      <h2 className="text-xl font-bold text-ink">Hoàn thành ván chơi</h2>
      <Button
        variant="primary"
        onClick={() => {
          resetGame();
          setActiveScreen('menu');
        }}
      >
        Về Menu chính
      </Button>
    </div>
  );
}
