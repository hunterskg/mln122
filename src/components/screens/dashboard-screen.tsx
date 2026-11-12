import React, { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { EventModal } from '@/components/events/event-modal';
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils';
import {
  Heart,
  Brain,
  Users,
  Wallet,
  MapPin,
  Briefcase,
  RotateCcw,
  Sparkles,
  History as HistoryIcon,
  Home,
  CheckCircle2,
} from 'lucide-react';

// Legacy components for backwards compatibility
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';

export function DashboardScreen() {
  const { lifeState, makeLifeChoice, resetLife, gameState } = useGameStore();
  const { setActiveScreen } = useUIStore();
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // If Life Sim state is present, render Life Sim Dashboard
  if (lifeState) {
    const p = lifeState.profile;
    const s = lifeState.stats;
    const lastHistory = lifeState.history.length > 0 ? lifeState.history[lifeState.history.length - 1] : null;

    // Helper status for cash
    const getCashStatus = (cash: number) => {
      if (cash < 0) return { label: 'Mang nợ tín dụng', color: 'text-rose-400 bg-rose-950/60 border-rose-800/80' };
      if (cash < 5000000) return { label: 'Chật vật sinh tồn', color: 'text-amber-400 bg-amber-950/60 border-amber-800/80' };
      if (cash < 30000000) return { label: 'Tạm đủ phòng thân', color: 'text-slate-300 bg-slate-800/60 border-slate-700/80' };
      if (cash < 100000000) return { label: 'Tích lũy vững vàng', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-800/80' };
      return { label: 'Có của ăn của để', color: 'text-amber-300 bg-amber-950/60 border-amber-600/80' };
    };

    // Helper status for health
    const getHealthStatus = (health: number) => {
      if (health <= 20) return { label: 'Nguy kịch kiệt cùng!', color: 'text-rose-400 bg-rose-950/80 border-rose-600', pulse: true };
      if (health <= 50) return { label: 'Hao mòn thể lực', color: 'text-amber-400 bg-amber-950/60 border-amber-700', pulse: false };
      if (health <= 75) return { label: 'Sức khỏe ổn định', color: 'text-slate-300 bg-slate-800/60 border-slate-700', pulse: false };
      return { label: 'Thể lực sung mãn', color: 'text-emerald-300 bg-emerald-950/60 border-emerald-700', pulse: false };
    };

    // Helper status for spirit
    const getSpiritStatus = (spirit: number) => {
      if (spirit <= 30) return { label: 'Bế tắc trầm uất', color: 'text-rose-400' };
      if (spirit <= 60) return { label: 'Căng thẳng lo âu', color: 'text-amber-400' };
      return { label: 'Minh mẫn lạc quan', color: 'text-indigo-300' };
    };

    // Helper status for kinship
    const getKinshipStatus = (kinship: number) => {
      if (kinship <= 30) return { label: 'Đơn độc chia lìa', color: 'text-rose-400' };
      if (kinship <= 60) return { label: 'Xã giao nhạt nhòa', color: 'text-slate-400' };
      return { label: 'Gia đình ấm êm', color: 'text-sky-300' };
    };

    const cashStatus = getCashStatus(s.tienMat);
    const healthStatus = getHealthStatus(s.sucKhoe);
    const spiritStatus = getSpiritStatus(s.tinhThan);
    const kinshipStatus = getKinshipStatus(s.quanHe);

    const xuatThanTextMap: Record<string, string> = {
      nong_thon_ngheo: 'Nông thôn thuần nông',
      lao_dong_do_thi: 'Lao động đô thị',
      tieu_tu_san: 'Hộ buôn bán nhỏ',
      tri_thuc_tinh_hoa: 'Trí thức tinh hoa',
      doanh_nhan_thanh_dat: 'Gia đình doanh nhân',
    };
    const xuatThanText = xuatThanTextMap[p.xuatThan] || 'Lao động tự do';

    return (
      <div className="space-y-6">
        {/* Top Identity & Controls Bar */}
        <div className="rounded-2xl border border-rule bg-paper-2 p-4 sm:p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Age Seal */}
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 flex flex-col items-center justify-center shrink-0">
              <span className="text-lg font-black font-mono leading-none">{p.tuoi}</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400/80">tuổi</span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-normal font-display text-ink tracking-tight">
                  {p.ten}
                </h1>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-paper-3 border border-rule text-ink-2 font-medium">
                  {p.gioiTinh === 'nam' ? 'Nam' : 'Nữ'} · Sinh năm {p.namSinh}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-muted mt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-400" />
                  {p.diaPhuong}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                  {p.ngheNghiep}
                </span>
                <span>•</span>
                <span className="text-amber-400/90 font-medium">
                  {xuatThanText}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="text-xs h-9 px-3 flex items-center gap-1.5 border-rule hover:border-accent/50 whitespace-nowrap"
            >
              <HistoryIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>Dòng thời gian ({lifeState.history.length})</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveScreen('menu')}
              className="text-xs h-9 px-3 text-ink-2 hover:text-white whitespace-nowrap"
            >
              <Home className="w-4 h-4 mr-1" />
              <span>Menu</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="text-xs h-9 px-3 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Bốc lại</span>
            </Button>
          </div>
        </div>

        {/* 4 Distinct Vital Instruments */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* 1. Cash Vital */}
          <div className="p-4 rounded-xl border border-rule bg-paper-2 space-y-2 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-semibold text-ink-2">
                <Wallet className="w-4 h-4 text-emerald-400" />
                Tiền phòng thân
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase border ${cashStatus.color}`}>
                {cashStatus.label}
              </span>
            </div>

            <div
              className={`text-xl sm:text-2xl font-black font-mono tabular-nums tracking-tight ${
                s.tienMat < 0 ? 'text-rose-400' : 'text-emerald-300'
              }`}
            >
              {formatCurrency(s.tienMat)}
            </div>

            <p className="text-[11px] text-muted leading-tight">
              {s.tienMat < 0
                ? 'Đang chịu lãi nợ sinh tồn hàng tháng.'
                : 'Khả năng chống đỡ các cú sốc bất ngờ.'}
            </p>
          </div>

          {/* 2. Health Vital */}
          <div className={`p-4 rounded-xl border bg-paper-2 space-y-2 shadow-sm ${
            healthStatus.pulse ? 'border-rose-500 animate-pulse bg-rose-950/20' : 'border-rule'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-semibold text-ink-2">
                <Heart className="w-4 h-4 text-rose-400" />
                Thể lực sinh học
              </span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">
                {s.sucKhoe}/100
              </span>
            </div>

            <div className="w-full bg-paper h-3 rounded-full overflow-hidden p-0.5 border border-rule-subtle">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  s.sucKhoe > 60
                    ? 'bg-emerald-500'
                    : s.sucKhoe > 30
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, s.sucKhoe))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted">Trạng thái:</span>
              <span className={`font-semibold ${s.sucKhoe <= 20 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                {healthStatus.label}
              </span>
            </div>
          </div>

          {/* 3. Mental Spirit Vital */}
          <div className="p-4 rounded-xl border border-rule bg-paper-2 space-y-2 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-semibold text-ink-2">
                <Brain className="w-4 h-4 text-indigo-400" />
                Sức bền tinh thần
              </span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">
                {s.tinhThan}/100
              </span>
            </div>

            <div className="w-full bg-paper h-3 rounded-full overflow-hidden p-0.5 border border-rule-subtle">
              <div
                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, s.tinhThan))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted">Tâm lý:</span>
              <span className={`font-semibold ${spiritStatus.color}`}>
                {spiritStatus.label}
              </span>
            </div>
          </div>

          {/* 4. Kinship Vital */}
          <div className="p-4 rounded-xl border border-rule bg-paper-2 space-y-2 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-semibold text-ink-2">
                <Users className="w-4 h-4 text-sky-400" />
                Tình cảm thân tộc
              </span>
              <span className="font-mono font-bold text-slate-200 tabular-nums">
                {s.quanHe}/100
              </span>
            </div>

            <div className="w-full bg-paper h-3 rounded-full overflow-hidden p-0.5 border border-rule-subtle">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.max(0, Math.min(100, s.quanHe))}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted">Gia đình:</span>
              <span className={`font-semibold ${kinshipStatus.color}`}>
                {kinshipStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Immediate Turn Consequence Feedback (Vừa trải qua) */}
        {lastHistory && (
          <div className="rounded-xl bg-amber-500/10 border border-amber-500/25 p-3.5 flex items-start gap-3 text-xs">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <div className="text-ink font-medium">
                <span className="font-bold text-amber-300">Vừa trải qua mốc {lastHistory.tuoi} tuổi ({lastHistory.tieuDeCanh}): </span>
                Bạn đã chọn <span className="font-bold text-white">"{lastHistory.vanBanLuaChon}"</span>.
              </div>
              {lastHistory.ghiChuHauQua && (
                <p className="text-muted italic">
                  {lastHistory.ghiChuHauQua}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Main Center Stage: Game Over or Active Scene */}
        {lifeState.isGameOver ? (
          <div className="rounded-2xl border-2 border-amber-500/50 bg-paper-2 p-8 text-center space-y-5 shadow-2xl relative overflow-hidden">
            <div className="inline-flex items-center justify-center p-4 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 mb-1">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-amber-400 block">
                Chặng đường đã khép lại
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal font-display text-white">
                Cuộc đời {p.ten} ở tuổi {p.tuoi}
              </h2>
              <p className="text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-body pt-1">
                {lifeState.lyDoKetThuc || 'Bạn đã đi hết chặng đường của kiếp nhân sinh.'}
              </p>
            </div>

            <div className="pt-3">
              <Button
                size="lg"
                variant="primary"
                onClick={() => setActiveScreen('report')}
                className="font-bold py-3.5 px-8 text-base shadow-2xl bg-amber-500 hover:bg-amber-400 text-black border-none"
              >
                Nhìn lại toàn bộ cuộc đời & Suy ngẫm
              </Button>
            </div>
          </div>
        ) : (
          lifeState.activeScene && (
            <EventModal
              scene={lifeState.activeScene}
              tuoi={p.tuoi}
              onSelectChoice={(choiceId) => makeLifeChoice(choiceId)}
            />
          )
        )}

        {/* Collapsible Timeline Drawer / Section */}
        {showHistoryDrawer && lifeState.history.length > 0 && (
          <div className="rounded-2xl border border-rule bg-paper p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-rule-subtle pb-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink-2">
                <HistoryIcon className="w-4 h-4 text-amber-400" />
                <span>Toàn bộ hành trình nhân sinh ({lifeState.history.length} cột mốc)</span>
              </div>
              <button
                type="button"
                onClick={() => setShowHistoryDrawer(false)}
                className="text-xs text-muted hover:text-white"
              >
                Đóng lại
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {[...lifeState.history].reverse().map((item, idx) => (
                <div
                  key={`${item.turn}-${idx}`}
                  className="p-3.5 rounded-xl bg-paper-2 border border-rule text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-300">
                      Năm {item.tuoi} tuổi: {item.tieuDeCanh}
                    </span>
                    <span className="text-muted font-mono">
                      Lượt #{item.turn}
                    </span>
                  </div>
                  <div className="text-white font-medium">
                    ✓ Đã chọn: <span className="text-emerald-300">"{item.vanBanLuaChon}"</span>
                  </div>
                  {item.ghiChuHauQua && (
                    <div className="text-[11px] text-muted italic font-body">
                      {item.ghiChuHauQua}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Confirm Reset Modal */}
        <ConfirmModal
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={() => {
            setShowResetConfirm(false);
            resetLife();
            setActiveScreen('setup');
          }}
          title="Bốc một cuộc đời mới"
          message="Bạn có chắc chắn muốn kết thúc tiến trình hiện tại và bốc ngẫu nhiên một cuộc đời mới không? Toàn bộ chỉ số hiện thời sẽ được làm mới."
          confirmText="Bốc lại ngay"
          cancelText="Giữ lại"
          variant="warning"
        />
      </div>
    );
  }

  // Fallback: Legacy Enterprise Dashboard
  if (!gameState) return null;

  return (
    <div className="space-y-6">
      <KpiCards state={gameState} />
      <AnalyticsChart state={gameState} />
    </div>
  );
}
