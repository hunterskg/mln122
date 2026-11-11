'use client';

import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  chapterTitle?: string;
}

export function ProgressBar({ current, total, chapterTitle }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-stone-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-2 w-2 rounded-full bg-rose-600 animate-pulse" />
          <span>{chapterTitle || 'Kinh tế chính trị Mác - Lênin'}</span>
        </div>
        <div className="font-mono text-stone-300">
          Câu <span className="text-rose-400 font-bold">{current}</span> / {total} ({percentage}%)
        </div>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-stone-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-rose-700 via-rose-600 to-amber-500 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
