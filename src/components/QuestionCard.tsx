'use client';

import React from 'react';
import { Question, Option } from '@/types/quiz';
import { BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { TheoryDiagram } from './TheoryDiagram';

interface QuestionCardProps {
  question: Question;
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  showFeedback?: boolean; // In practice mode or after submitting
  isLocked?: boolean;
}

export function QuestionCard({
  question,
  selectedOptionId,
  onSelectOption,
  showFeedback = false,
  isLocked = false,
}: QuestionCardProps) {
  const letters = ['A', 'B', 'C', 'D'];

  const getOptionStyle = (option: Option, index: number) => {
    const isSelected = selectedOptionId === option.id;
    const isCorrect = option.id === question.correctOptionId;

    if (!showFeedback) {
      if (isSelected) {
        return 'border-rose-500 bg-rose-950/60 text-stone-100 ring-2 ring-rose-500/50 shadow-lg shadow-rose-950/50 backdrop-blur-md';
      }
      return 'border-stone-800/80 bg-stone-950/60 text-stone-300 hover:border-stone-600 hover:bg-stone-900/80 hover:text-stone-100 backdrop-blur-md';
    }

    // Feedback Mode
    if (isCorrect) {
      return 'border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-2 ring-emerald-500/50';
    }
    if (isSelected && !isCorrect) {
      return 'border-rose-600 bg-rose-950/50 text-rose-100 ring-2 ring-rose-600/50';
    }
    return 'border-stone-800/60 bg-stone-900/40 text-stone-500 opacity-60';
  };

  return (
    <div className="w-full space-y-6">
      {/* Scenario / Dilemma Section */}
      <div className="relative overflow-hidden rounded-2xl border border-stone-800/90 bg-stone-950/80 p-5 sm:p-7 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600 z-10" />

        {/* Top Badges & Meta */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-950 text-rose-300 border border-rose-800/80 uppercase tracking-wider">
              Tình Huống Thực Tế
            </span>
            <span className="text-xs text-stone-400 font-mono">
              Chương {question.chapterId}
            </span>
          </div>

          {question.imageAlt && (
            <span className="text-[11px] text-stone-300 font-mono bg-stone-900/80 px-2.5 py-1 rounded-md border border-stone-800">
              {question.imageAlt}
            </span>
          )}
        </div>

        {/* Scenario & Photograph Layout */}
        <div className={`grid gap-5 ${question.imageUrl ? 'md:grid-cols-12 md:items-center' : ''}`}>
          {question.imageUrl && (
            <div className="md:col-span-5 overflow-hidden rounded-xl border border-stone-700/80 bg-stone-900 shadow-lg group">
              <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={question.imageUrl}
                  alt={question.imageAlt || 'Hình ảnh tình huống'}
                  className="w-full h-full object-cover brightness-95 contrast-105 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/60 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          )}

          <div className={`${question.imageUrl ? 'md:col-span-7' : 'w-full'} space-y-3`}>
            <p className="text-base sm:text-lg leading-relaxed text-stone-100 italic font-light border-l-2 border-rose-500 pl-4 py-1">
              &ldquo;{question.scenario}&rdquo;
            </p>

            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white pt-1">
              {question.question}
            </h3>
          </div>
        </div>
      </div>

      {/* 4 Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => {
          const isSelected = selectedOptionId === option.id;
          const isCorrect = option.id === question.correctOptionId;

          return (
            <button
              key={option.id}
              type="button"
              disabled={isLocked}
              onClick={() => onSelectOption(option.id)}
              className={`w-full text-left rounded-xl border p-4 md:p-5 transition-all duration-200 flex items-start gap-4 cursor-pointer disabled:cursor-default ${getOptionStyle(
                option,
                idx
              )}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-bold text-sm transition-colors ${
                  showFeedback && isCorrect
                    ? 'bg-emerald-500 text-stone-950'
                    : showFeedback && isSelected && !isCorrect
                    ? 'bg-rose-600 text-white'
                    : isSelected
                    ? 'bg-rose-600 text-white'
                    : 'bg-stone-800 text-stone-400 border border-stone-700'
                }`}
              >
                {letters[idx]}
              </div>

              <div className="flex-1 text-sm md:text-base leading-relaxed">
                {option.text}
              </div>

              {showFeedback && (
                <div className="shrink-0 self-center">
                  {isCorrect && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
                  {isSelected && !isCorrect && <XCircle className="h-6 w-6 text-rose-500" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (when feedback enabled and option selected) */}
      {showFeedback && selectedOptionId && (
        <div className="rounded-2xl border border-stone-700/80 bg-stone-900/90 p-6 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
            <BookOpen className="h-4 w-4" />
            <span>Giải Thích Lý Luận Cốt Lõi</span>
          </div>

          {/* Theoretical Interactive / Visual Diagram */}
          <TheoryDiagram type={question.diagramType} />

          <div className="space-y-3 text-sm text-stone-300 leading-relaxed">
            <div>
              <strong className="text-white">Bản chất Mácxít: </strong>
              {question.explanation.marxistCore}
            </div>

            <div className="p-3 rounded-lg bg-stone-950/60 border border-stone-800/80 text-stone-400 text-xs">
              <span className="text-amber-400 font-semibold">Phân tích sai lầm các phương án khác: </span>
              {question.explanation.fallacyBreakdown}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-400 pt-1 border-t border-stone-800">
              <span className="font-semibold text-stone-300">Tra cứu:</span>
              <span>{question.explanation.textbookRef.curriculum} — Chương {question.explanation.textbookRef.chapter}, {question.explanation.textbookRef.section} (Trang {question.explanation.textbookRef.page || '...'})</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
