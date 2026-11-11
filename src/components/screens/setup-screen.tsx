import React, { useState } from 'react';
import { useUIStore } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { generateInitialLife } from '@/engine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Brain,
  Users,
  Wallet,
  MapPin,
  Briefcase,
  User,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export function SetupScreen() {
  const { setActiveScreen, addToast } = useUIStore();
  const { initNewLife } = useGameStore();

  const [currentSeed, setCurrentSeed] = useState(() => Math.floor(Date.now() % 10000000));
  const [previewLife, setPreviewLife] = useState(() => generateInitialLife(currentSeed));

  const handleReroll = () => {
    const nextSeed = Math.floor(Math.random() * 10000000);
    setCurrentSeed(nextSeed);
    setPreviewLife(generateInitialLife(nextSeed));
  };

  const handleStartLife = () => {
    initNewLife(currentSeed);
    addToast({
      type: 'success',
      title: 'Chào mừng bước vào đời!',
      description: `${previewLife.profile.ten} bắt đầu hành trình ở tuổi 18 tại ${previewLife.profile.diaPhuong}.`,
    });
    setActiveScreen('dashboard');
  };

  const xuatThanLabels: Record<string, { label: string; desc: string; tagColor: string }> = {
    nong_thon_ngheo: {
      label: 'Nông thôn thuần nông',
      desc: 'Gia đình bám ruộng vườn, thu nhập mùa vụ bấp bênh, phòng thân ít ỏi.',
      tagColor: 'text-amber-400 bg-amber-950/40 border-amber-800/60',
    },
    lao_dong_do_thi: {
      label: 'Lao động phổ thông đô thị',
      desc: 'Bố mẹ làm công nhân hoặc buôn bán vỉa hè chật vật, tiền trọ hàng tháng.',
      tagColor: 'text-sky-400 bg-sky-950/40 border-sky-800/60',
    },
    tieu_tu_san: {
      label: 'Hộ kinh doanh buôn bán',
      desc: 'Gia đình có cửa hàng tạp hóa hoặc tiệm sửa xe nhỏ, có chút vốn phòng thân.',
      tagColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/60',
    },
  };

  const vungMienLabels: Record<string, string> = {
    bac: 'Miền Bắc',
    trung: 'Miền Trung',
    nam: 'Miền Nam',
  };

  const p = previewLife.profile;
  const s = previewLife.stats;
  const xt = xuatThanLabels[p.xuatThan] || xuatThanLabels.lao_dong_do_thi;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setActiveScreen('menu')}
          className="flex items-center gap-2 text-muted hover:text-ink whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Menu chính</span>
        </Button>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Lá thăm cuộc đời (Lottery of Birth)</span>
        </div>
      </div>

      {/* Main Lottery Card */}
      <Card className="bg-paper-2 border-rule shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <CardHeader className="border-b border-rule-subtle pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] font-mono text-muted uppercase tracking-widest block">
                Mã số sinh mệnh #{currentSeed}
              </span>
              <CardTitle className="text-2xl sm:text-3xl font-normal font-display text-ink flex items-center gap-2 mt-0.5">
                <User className="w-6 h-6 text-amber-400" />
                <span>{p.ten}</span>
                <span className="text-sm font-normal text-muted">({p.gioiTinh === 'nam' ? 'Nam' : 'Nữ'} · 18 tuổi)</span>
              </CardTitle>
            </div>
            <div className={`px-2.5 py-1 rounded border text-xs font-semibold self-start sm:self-auto whitespace-nowrap ${xt.tagColor}`}>
              {xt.label}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          {/* Birthplace and Family Background */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-paper rounded-xl border border-rule-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-muted font-semibold">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Quê quán & Vùng miền</span>
              </div>
              <div className="text-sm font-bold text-ink">
                {p.diaPhuong} ({vungMienLabels[p.vungMien]})
              </div>
            </div>

            <div className="p-3 bg-paper rounded-xl border border-rule-subtle space-y-1">
              <div className="flex items-center gap-1.5 text-muted font-semibold">
                <Briefcase className="w-3.5 h-3.5 text-sky-400" />
                <span>Hướng đi tuổi 18</span>
              </div>
              <div className="text-sm font-bold text-ink">{p.ngheNghiep}</div>
            </div>
          </div>

          {/* Detailed Narrative Background */}
          <div className="p-4 bg-paper rounded-xl border border-rule-subtle text-xs text-ink-2 leading-relaxed space-y-2">
            <div className="text-muted font-semibold uppercase tracking-wider text-[10px]">
              Hoàn cảnh gia đình xuất phát:
            </div>
            <p className="font-body text-[13px] leading-relaxed">{p.tieuSuNgan}</p>
            <p className="text-[11px] text-muted italic pt-1 border-t border-rule-subtle font-sans">
              {xt.desc}
            </p>
          </div>

          {/* Starting Stats Matrix */}
          <div className="space-y-2">
            <div className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Tài nguyên & Năng lực sinh tồn ban đầu
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-3 bg-paper rounded-lg border border-rule-subtle text-center">
                <div className="flex items-center justify-center gap-1 text-muted mb-1">
                  <Wallet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Tiền mặt</span>
                </div>
                <div className="text-sm font-bold font-mono text-emerald-300">{formatCurrency(s.tienMat)}</div>
              </div>

              <div className="p-3 bg-paper rounded-lg border border-rule-subtle text-center">
                <div className="flex items-center justify-center gap-1 text-muted mb-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <span>Sức khỏe</span>
                </div>
                <div className="text-sm font-bold font-mono text-ink">{s.sucKhoe} / 100</div>
              </div>

              <div className="p-3 bg-paper rounded-lg border border-rule-subtle text-center">
                <div className="flex items-center justify-center gap-1 text-muted mb-1">
                  <Brain className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tinh thần</span>
                </div>
                <div className="text-sm font-bold font-mono text-indigo-300">{s.tinhThan} / 100</div>
              </div>

              <div className="p-3 bg-paper rounded-lg border border-rule-subtle text-center">
                <div className="flex items-center justify-center gap-1 text-muted mb-1">
                  <Users className="w-3.5 h-3.5 text-sky-400" />
                  <span>Quan hệ</span>
                </div>
                <div className="text-sm font-bold font-mono text-sky-300">{s.quanHe} / 100</div>
              </div>
            </div>
          </div>

          {/* Philosophical Note */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <p className="leading-relaxed font-body">
              Bạn không thể lựa chọn nơi mình sinh ra, nhưng mọi lựa chọn đánh đổi giữa thời gian, sức lao động và tiền bạc sắp tới sẽ định hình nên cuộc đời bạn.
            </p>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleReroll}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 border-rule hover:border-accent text-ink whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4 text-muted" />
              <span>Bốc lại lá thăm khác</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleStartLife}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2 font-bold bg-amber-500 hover:bg-amber-400 text-black border-none whitespace-nowrap"
            >
              <span>Bước vào cuộc đời</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
