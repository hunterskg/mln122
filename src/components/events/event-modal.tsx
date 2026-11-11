import React, { useEffect } from 'react';
import { LifeScene, LifeChoice } from '@/engine';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { ArrowRight, Heart, Brain, Users, Wallet, Clock, Sparkles } from 'lucide-react';

interface EventModalProps {
  scene?: LifeScene;
  tuoi?: number;
  onSelectChoice?: (choiceId: string) => void;
  // Legacy compatibility props
  event?: any;
  selectedOptionId?: string;
  onSelectOption?: (id: string) => void;
}

export function EventModal({ scene, tuoi, onSelectChoice, event, selectedOptionId, onSelectOption }: EventModalProps) {
  // Keyboard shortcut listener (Keys '1', '2', '3', '4' for instant tactile selection)
  useEffect(() => {
    if (!scene || !onSelectChoice) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= scene.luaChon.length) {
        e.preventDefault();
        const choice = scene.luaChon[num - 1];
        if (choice) {
          onSelectChoice(choice.id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [scene, onSelectChoice]);

  // Fallback for legacy enterprise event
  if (!scene && event) {
    return (
      <Card className='bg-paper-2 border-rule shadow-xl'>
        <CardHeader className='border-b border-rule-subtle pb-3'>
          <h3 className='text-ink font-bold text-base'>{event.title}</h3>
        </CardHeader>
        <CardContent className='space-y-4 pt-4'>
          <p className='text-xs text-muted leading-relaxed'>{event.description}</p>
          <div className='grid grid-cols-1 gap-2.5'>
            {event.options.map((opt: any) => {
              const isSelected = selectedOptionId === opt.id;
              return (
                <div
                  key={opt.id}
                  onClick={() => onSelectOption && onSelectOption(opt.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500 text-slate-100'
                      : 'bg-paper border-rule text-slate-300 hover:border-rule-subtle'
                  }`}>
                  <div className='font-semibold text-slate-100'>{opt.label}</div>
                  <div className='text-[11px] text-slate-400 mt-1'>{opt.impactSummary}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!scene) return null;

  const currentAge = tuoi ?? scene.giaiDoanTuoi[0];

  // Helper life-stage label
  const getStageLabel = (age: number) => {
    if (age < 23) return 'Khởi sự lập thân';
    if (age < 35) return 'Xây dựng sinh kế';
    if (age < 50) return 'Gánh nặng trung niên';
    if (age < 62) return 'Sườn dốc sức lao động';
    return 'Hoàng hôn đời người';
  };

  return (
    <div className='space-y-5'>
      {/* Central Life Stage Card */}
      <div className='rounded-2xl border border-rule bg-paper-2 p-5 sm:p-7 shadow-2xl relative overflow-hidden'>
        {/* Subtle decorative glow */}
        <div className='absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none' />

        {/* Scene Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rule-subtle pb-4 mb-5'>
          <div>
            <div className='flex items-center gap-2 mb-1 flex-wrap'>
              <span className='px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-bold tracking-wide whitespace-nowrap'>
                Năm {currentAge} tuổi · {getStageLabel(currentAge)}
              </span>
            </div>
            <h2 className='text-2xl sm:text-3xl font-normal font-display text-ink tracking-tight'>
              {scene.tieuDe.normalize('NFC')}
            </h2>
          </div>
          <div className='text-xs text-muted bg-paper px-3 py-1.5 rounded-lg border border-rule-subtle font-body self-start sm:self-auto shrink-0 whitespace-nowrap'>
            <span className='font-mono font-semibold'>{scene.luaChon.length}</span> lựa chọn
          </div>
        </div>

        {/* Story Narrative Box */}
        <div className='rounded-xl bg-paper border-l-4 border-l-amber-500/80 border-y border-r border-rule-subtle p-5 sm:p-6 mb-6'>
          <p className='text-base sm:text-[17px] text-ink font-body leading-relaxed whitespace-pre-line'>
            {scene.vanBan.normalize('NFC')}
          </p>
        </div>

        {/* Choices Section */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between text-xs font-bold uppercase tracking-wider text-ink-2'>
            <span className='flex items-center gap-1.5'>
              <Sparkles className='w-3.5 h-3.5 text-amber-400' />
              Lựa chọn hành động của bạn
            </span>
            <span className='text-[11px] font-normal lowercase italic text-muted hidden sm:inline'>
              Nhấn phím 1, 2, 3 trên bàn phím để chọn nhanh
            </span>
          </div>

          <div className='grid grid-cols-1 gap-3.5'>
            {scene.luaChon.map((choice: LifeChoice, idx: number) => {
              const delta = choice.tacDong;
              const hotkey = idx + 1;

              return (
                <button
                  key={choice.id}
                  type='button'
                  onClick={() => onSelectChoice && onSelectChoice(choice.id)}
                  className='life-choice-card w-full text-left p-4 sm:p-5 rounded-xl cursor-pointer group flex flex-col justify-between gap-3 relative focus:outline-none focus:ring-2 focus:ring-amber-400'>
                  <div className='flex items-start justify-between gap-3'>
                    <div className='flex items-start gap-3.5'>
                      {/* Tactile Hotkey Badge */}
                      <span className='w-7 h-7 rounded-lg bg-paper-3 border border-rule text-amber-300 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-amber-500 group-hover:text-black group-hover:border-amber-400 transition-colors'>
                        {hotkey}
                      </span>
                      <div>
                        {choice.nhanDacBiet && (
                          <span className='inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/15 border border-amber-500/35 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-1.5 font-body'>
                            {choice.nhanDacBiet.normalize('NFC')}
                          </span>
                        )}
                        <div className='text-base font-bold text-ink font-body group-hover:text-amber-200 transition-colors'>
                          {choice.vanBan.normalize('NFC')}
                        </div>
                        {choice.moTaHauQuaNgan && (
                          <p className='text-xs sm:text-sm text-ink-2 mt-1.5 leading-relaxed font-body'>
                            {choice.moTaHauQuaNgan.normalize('NFC')}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className='p-2 rounded-lg bg-paper-3 border border-rule text-muted group-hover:text-amber-300 group-hover:border-amber-500/40 group-hover:translate-x-0.5 transition shrink-0 mt-0.5'>
                      <ArrowRight className='w-4 h-4' />
                    </div>
                  </div>

                  {/* Impact & Trade-off Badges */}
                  <div className='flex flex-wrap items-center gap-2 pt-2.5 border-t border-rule-subtle text-xs'>
                    {/* Cash delta */}
                    {delta.tienMatDelta !== undefined && delta.tienMatDelta !== 0 && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold whitespace-nowrap ${
                          delta.tienMatDelta > 0
                            ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-700/60'
                            : 'text-rose-300 bg-rose-950/60 border border-rose-700/60'
                        }`}>
                        <Wallet className='w-3.5 h-3.5 shrink-0' />
                        <span className='font-mono tabular-nums'>
                          {delta.tienMatDelta > 0 ? '+' : ''}
                          {formatCurrency(delta.tienMatDelta)}
                        </span>
                      </span>
                    )}

                    {/* Health delta */}
                    {delta.sucKhoeDelta !== undefined && delta.sucKhoeDelta !== 0 && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold whitespace-nowrap ${
                          delta.sucKhoeDelta > 0
                            ? 'text-emerald-300 bg-emerald-950/60 border border-emerald-700/60'
                            : 'text-rose-300 bg-rose-950/60 border border-rose-700/60'
                        }`}>
                        <Heart className='w-3.5 h-3.5 shrink-0' />
                        <span className='font-mono tabular-nums'>
                          {delta.sucKhoeDelta > 0 ? '+' : ''}
                          {delta.sucKhoeDelta}
                        </span>
                        <span className='font-body'>Thể lực</span>
                      </span>
                    )}

                    {/* Spirit delta */}
                    {delta.tinhThanDelta !== undefined && delta.tinhThanDelta !== 0 && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold whitespace-nowrap ${
                          delta.tinhThanDelta > 0
                            ? 'text-indigo-300 bg-indigo-950/60 border border-indigo-700/60'
                            : 'text-amber-300 bg-amber-950/60 border border-amber-700/60'
                        }`}>
                        <Brain className='w-3.5 h-3.5 shrink-0' />
                        <span className='font-mono tabular-nums'>
                          {delta.tinhThanDelta > 0 ? '+' : ''}
                          {delta.tinhThanDelta}
                        </span>
                        <span className='font-body'>Tinh thần</span>
                      </span>
                    )}

                    {/* Kinship delta */}
                    {delta.quanHeDelta !== undefined && delta.quanHeDelta !== 0 && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold whitespace-nowrap ${
                          delta.quanHeDelta > 0
                            ? 'text-sky-300 bg-sky-950/60 border border-sky-700/60'
                            : 'text-slate-300 bg-slate-900 border border-slate-700'
                        }`}>
                        <Users className='w-3.5 h-3.5 shrink-0' />
                        <span className='font-mono tabular-nums'>
                          {delta.quanHeDelta > 0 ? '+' : ''}
                          {delta.quanHeDelta}
                        </span>
                        <span className='font-body'>Quan hệ</span>
                      </span>
                    )}

                    {/* Aging step */}
                    {choice.buocNhayTuoi && (
                      <span className='inline-flex items-center gap-1 text-[11px] text-muted font-body ml-auto whitespace-nowrap'>
                        <Clock className='w-3 h-3 text-amber-400' />
                        <span className='font-mono'>+{choice.buocNhayTuoi}</span> năm tuổi
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
