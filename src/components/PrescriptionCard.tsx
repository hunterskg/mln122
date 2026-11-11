'use client';

import React from 'react';
import chaptersData from '@/data/chapters.json';
import { BookMarked, CheckCircle, AlertTriangle, ArrowRight } from 'lucide-react';

interface PrescriptionCardProps {
  chapterScores: {
    chapterId: number;
    chapterTitle: string;
    percentage: number;
    status: 'mastered' | 'pass' | 'review_needed';
  }[];
}

export function PrescriptionCard({ chapterScores }: PrescriptionCardProps) {
  const needsReview = chapterScores.filter((c) => c.status === 'review_needed');
  const passed = chapterScores.filter((c) => c.status === 'pass');
  const mastered = chapterScores.filter((c) => c.status === 'mastered');

  return (
    <div className="space-y-6 rounded-2xl border border-stone-800 bg-stone-900/80 p-6 md:p-8 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-stone-800 pb-4">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookMarked className="h-5 w-5 text-amber-500" />
            Đơn Thuốc Lý Luận & Lộ Trình Ôn Tập
          </h3>
          <p className="text-xs text-stone-400 mt-1">
            Chẩn đoán theo Giáo trình Kinh tế chính trị Mác - Lênin (Bộ GD&ĐT 2021)
          </p>
        </div>
      </div>

      {needsReview.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4" />
            <span>Vùng kiến thức có nguy cơ mất điểm cao (Cần ôn gấp)</span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {needsReview.map((item) => {
              const meta = chaptersData.find((c) => c.id === item.chapterId);
              return (
                <div
                  key={item.chapterId}
                  className="rounded-xl border border-rose-900/60 bg-rose-950/20 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-300 text-sm">
                      Chương {item.chapterId}: {item.chapterTitle}
                    </span>
                    <span className="rounded-md bg-rose-950 px-2 py-0.5 font-mono text-xs font-bold text-rose-400 border border-rose-800">
                      {item.percentage}%
                    </span>
                  </div>

                  <p className="text-xs text-stone-400">
                    Trọng tâm: {meta?.coreConcepts.slice(0, 3).join(', ')}
                  </p>

                  <div className="pt-2 border-t border-rose-950 text-xs text-amber-300 flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    <span>Đọc: {meta?.recommendedPages}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {mastered.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
            <CheckCircle className="h-4 w-4" />
            <span>Chương đã nắm vững bản chất (&ge; 75%)</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {mastered.map((item) => (
              <span
                key={item.chapterId}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-900/60 bg-emerald-950/30 px-3 py-1.5 text-xs text-emerald-300"
              >
                Chương {item.chapterId}: {item.chapterTitle} ({item.percentage}%)
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
