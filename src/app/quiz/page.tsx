'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import questionsData from '@/data/questions.json';
import chaptersData from '@/data/chapters.json';
import { Question } from '@/types/quiz';
import { ProgressBar } from '@/components/ProgressBar';
import { QuestionCard } from '@/components/QuestionCard';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import Link from 'next/link';

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') === 'exam' ? 'exam' : 'practice';

  const [mode, setMode] = useState<'practice' | 'exam'>(initialMode);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions: Question[] = questionsData as Question[];
  const currentQuestion = questions[currentIndex];
  const currentChapter = chaptersData.find((c) => c.id === currentQuestion.chapterId);

  const selectedOptionId = answers[currentQuestion.id];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  const handleSelectOption = (optionId: string) => {
    // In practice mode, if already chosen, allow changing or keep
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Save answers into sessionStorage for results page
    try {
      sessionStorage.setItem('mln_user_answers', JSON.stringify(answers));
    } catch (e) {
      console.error(e);
    }
    router.push('/result');
  };

  return (
    <div className="relative min-h-screen bg-stone-950 text-stone-100 overflow-x-hidden">
      {/* Full-Screen Atmospheric Background Image (Guaranteed Visible at z-0) */}
      {currentQuestion.imageUrl && (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={currentQuestion.id}
            src={currentQuestion.imageUrl}
            alt=""
            className="w-full h-full object-cover scale-105 filter blur-[10px] brightness-[0.45] contrast-110 opacity-75 transition-all duration-700 ease-out"
          />
          {/* Gradient Overlay for Reading Comfort */}
          <div className="absolute inset-0 bg-stone-950/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/80" />
        </div>
      )}

      {/* Interactive Content at z-10 */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Top Bar */}
        <header className="border-b border-stone-800/80 bg-stone-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-medium text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Trang Chủ</span>
          </Link>

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-900 border border-stone-800 text-xs">
            <button
              onClick={() => setMode('practice')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                mode === 'practice'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Luyện Tập
            </button>
            <button
              onClick={() => setMode('exam')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                mode === 'exam'
                  ? 'bg-rose-700 text-white shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Thi Chẩn Đoán
            </button>
          </div>
        </div>
      </header>

      {/* Main Quiz Area */}
      <main className="max-w-4xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        <ProgressBar
          current={currentIndex + 1}
          total={totalQuestions}
          chapterTitle={`Chương ${currentQuestion.chapterId}: ${currentChapter?.shortTitle}`}
        />

        <QuestionCard
          question={currentQuestion}
          selectedOptionId={selectedOptionId}
          onSelectOption={handleSelectOption}
          showFeedback={mode === 'practice' && !!selectedOptionId}
        />

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-800/80">
          <button
            type="button"
            disabled={currentIndex === 0}
            onClick={handlePrevious}
            className="px-4 py-2.5 rounded-xl border border-stone-800 bg-stone-900 text-stone-300 hover:bg-stone-800 disabled:opacity-40 disabled:hover:bg-stone-900 text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Câu trước</span>
          </button>

          <div className="text-xs text-stone-500 font-mono hidden sm:block">
            Đã làm {answeredCount}/{totalQuestions} câu
          </div>

          {currentIndex < totalQuestions - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-sm font-semibold flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-rose-950/40"
            >
              <span>Câu kế tiếp</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-sm font-bold flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Xem Kết Quả Chẩn Đoán</span>
            </button>
          )}
        </div>
      </main>

        {/* Footer info */}
        <footer className="border-t border-stone-800/60 py-4 text-center text-[11px] text-stone-500">
          Giáo trình Kinh tế chính trị Mác - Lênin (Bộ GD&ĐT 2021) • Chế độ: {mode === 'practice' ? 'Luyện tập giải thích tức thì' : 'Thi chẩn đoán tổng kết'}
        </footer>
      </div>
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-400 text-sm">
          Đang khởi tạo bài trắc nghiệm...
        </div>
      }
    >
      <QuizContent />
    </Suspense>
  );
}
