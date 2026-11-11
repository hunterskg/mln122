import React, { useState } from 'react';
import { GameEvent } from '@/engine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

export function EventModal({
  event,
  selectedOptionId,
  onSelectOption,
}: {
  event: GameEvent;
  selectedOptionId?: string;
  onSelectOption: (id: string) => void;
}) {
  const [showInsight, setShowInsight] = useState(true);

  return (
    <Card className="bg-amber-950/20 border-amber-600/40 shadow-lg animate-in fade-in">
      <CardHeader className="border-b border-amber-600/20 pb-2.5 mb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
            <CardTitle className="text-amber-400 font-bold normal-case text-sm tracking-normal">
              Sự kiện điều hành: {event.title}
            </CardTitle>
          </div>
          <span className="text-[11px] text-amber-300/80 font-medium bg-amber-950/50 px-2 py-0.5 rounded border border-amber-600/30">
            Yêu cầu quyết định
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3.5">
        <p className="text-xs text-slate-200 leading-relaxed">{event.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {event.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onSelectOption(opt.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500 ring-1 ring-amber-500 text-slate-100'
                    : 'bg-slate-950/70 border-slate-800 hover:border-amber-600/50 text-slate-300'
                }`}
              >
                <div>
                  <div className="font-bold text-slate-100 mb-1">{opt.label}</div>
                  <div className="text-[11px] text-slate-400 leading-snug">{opt.impactSummary}</div>
                </div>
                <div className="mt-3 text-[10px] font-semibold text-right">
                  <span className={isSelected ? 'text-amber-400 font-bold' : 'text-slate-500'}>
                    {isSelected ? '✓ Đã chọn quyết định này' : 'Nhấp để chọn quyết định'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {event.educationalInsight && (
          <div className="rounded-lg border border-sky-800/40 bg-sky-950/20 p-3 text-xs">
            <div
              className="flex items-center justify-between cursor-pointer select-none text-sky-400 font-semibold"
              onClick={() => setShowInsight(!showInsight)}
            >
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Góc nhìn Kinh tế chính trị Mác - Lênin</span>
              </div>
              {showInsight ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>

            {showInsight && (
              <div className="mt-2 text-slate-300 leading-relaxed space-y-1.5 pt-1 border-t border-sky-800/30">
                <p>{event.educationalInsight}</p>
                {event.sourceReference && (
                  <p className="text-[11px] text-sky-400/80 font-medium">
                    📖 Tham chiếu: {event.sourceReference.chapter}, {event.sourceReference.section} - Khái niệm: {event.sourceReference.concept}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
