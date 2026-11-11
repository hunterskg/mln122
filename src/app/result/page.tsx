'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import questionsData from '@/data/questions.json';
import { Question, DiagnosticResult } from '@/types/quiz';
import { calculateDiagnosticResult } from '@/lib/diagnostic';
import { DiagnosticRadarChart } from '@/components/RadarChart';
import { PrescriptionCard } from '@/components/PrescriptionCard';
import {
  Award,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Share2,
  Check,
  AlertCircle,
  ArrowLeft,
} from 'lucide-react';

export default function ResultPage() {
  const [result, setResult] = useState<DiagnosticResult | null>(null);
  const [showReview, setShowReview] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let answers: Record<string, string> = {};
    try {
      const stored = sessionStorage.getItem('mln_user_answers');
      if (stored) {
        answers = JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }

    // If empty (e.g. user refreshed or visited directly), populate with a reasonable default
    const questions = questionsData as Question[];
    if (Object.keys(answers).length === 0) {
      questions.forEach((q, idx) => {
        // Sample fallback answers
        answers[q.id] = idx % 2 === 0 ? q.correctOptionId : q.options[1].id;
      });
    }

    const diag = calculateDiagnosticResult(questions, answers);
    setResult(diag);
  }, []);

  const handleShare = () => {
    if (!result) return;
    const text = `Tôi vừa hoàn thành chẩn đoán tư duy Kinh tế chính trị Mác - Lênin: Đạt ${result.totalScorePercentage}% điểm và nhận danh hiệu [${result.archetype.name}]!`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-950 text-stone-400">
        Đang phân tích kết quả chẩn đoán...
      </div>
    );
  }

  const radarData = result.chapterScores.map((c) => ({
    subject: `Ch.${c.chapterId} (${c.percentage}%)`,
    score: c.percentage,
    fullMark: 100,
  }));

  const questions = questionsData as Question[];

  return (
    <main className="relative min-h-screen text-stone-100 py-10 px-4 sm:px-6 overflow-x-hidden">
      {/* Full-Screen Atmospheric Blurred Background */}
      {result.archetype.imageUrl && (
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.archetype.imageUrl}
            alt=""
            className="h-full w-full object-cover scale-110 filter blur-2xl brightness-[0.25] contrast-125"
          />
          <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-stone-950/80" />
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Top Navigation */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Về Trang Chủ</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 border border-stone-700 text-xs font-medium text-stone-300 hover:text-white transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-rose-400" />
              <span>{copied ? 'Đã sao chép!' : 'Chia sẻ kết quả'}</span>
            </button>
            <Link
              href="/quiz?mode=practice"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Làm Lại Bài</span>
            </Link>
          </div>
        </div>

        {/* Hero Diagnosis Header */}
        <div className="relative overflow-hidden rounded-3xl border border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950 p-6 md:p-10 shadow-2xl">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-700 via-amber-500 to-rose-700" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left flex-1">
              {result.archetype.imageUrl && (
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl border border-stone-700/80 shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.archetype.imageUrl}
                    alt={result.archetype.name}
                    className="h-full w-full object-cover brightness-[0.8] contrast-110"
                  />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
                </div>
              )}
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-800">
                  <ShieldCheck className="h-3.5 w-3.5 text-rose-400" />
                  Kết Quả Chẩn Đoán Tư Duy
                </span>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                  {result.archetype.name}
                </h1>
                <p className="text-sm text-amber-300 font-medium italic">
                  &ldquo;{result.archetype.tagline}&rdquo;
                </p>
                <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
                  {result.archetype.description}
                </p>
              </div>
            </div>

            {/* Score Ring */}
            <div className="shrink-0 flex flex-col items-center justify-center h-32 w-32 rounded-full border-4 border-rose-600/80 bg-stone-900/90 shadow-xl shadow-rose-950/60 p-4 text-center">
              <span className="text-3xl font-black text-white font-mono">
                {result.totalScorePercentage}%
              </span>
              <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">
                {result.correctAnswers}/{result.totalQuestions} Câu đúng
              </span>
            </div>
          </div>

          {/* Archetype Strengths & Weaknesses */}
          <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                Điểm mạnh nổi bật:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {result.archetype.strengths.map((s, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wide">
                Cạm bẫy tư duy cần chú ý:
              </span>
              <ul className="space-y-1.5 text-xs text-stone-300">
                {result.archetype.weaknesses.map((w, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertCircle className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Radar Chart & Chapter Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="h-4 w-4 text-rose-500" />
                Biểu Đồ Năng Lực 6 Chương
              </h2>
              <span className="text-[11px] text-stone-400">Tỷ lệ chuẩn xác (%)</span>
            </div>
            <DiagnosticRadarChart data={radarData} />
          </div>

          {/* Chapter Status List */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-amber-500" />
              Chi Tiết Từng Chương
            </h2>

            <div className="space-y-2.5">
              {result.chapterScores.map((c) => (
                <div
                  key={c.chapterId}
                  className="flex items-center justify-between p-3 rounded-xl border border-stone-800/80 bg-stone-950/40 text-xs"
                >
                  <div className="space-y-0.5">
                    <span className="font-semibold text-stone-200 block">
                      Chương {c.chapterId}: {c.chapterTitle}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      Đúng {c.correct}/{c.total} câu
                    </span>
                  </div>

                  <span
                    className={`font-mono font-bold px-2.5 py-1 rounded-md text-xs ${
                      c.status === 'mastered'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : c.status === 'pass'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {c.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prescription Card */}
        <PrescriptionCard chapterScores={result.chapterScores} />

        {/* Accordion: Review All Answers */}
        <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-6 space-y-4">
          <button
            type="button"
            onClick={() => setShowReview(!showReview)}
            className="w-full flex items-center justify-between text-left font-bold text-white text-base cursor-pointer hover:text-rose-400 transition-colors"
          >
            <span className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-rose-500" />
              Xem Lại Chi Tiết Toàn Bộ Đáp Án & Tra Cứu Giáo Trình ({questions.length} câu)
            </span>
            {showReview ? (
              <ChevronUp className="h-5 w-5 text-stone-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-stone-400" />
            )}
          </button>

          {showReview && (
            <div className="space-y-6 pt-4 border-t border-stone-800 animate-in fade-in duration-200">
              {questions.map((q, idx) => {
                const userAns = result.answers.find((a) => a.questionId === q.id);
                const isCorrect = userAns?.isCorrect;
                const chosenOption = q.options.find((o) => o.id === userAns?.selectedOptionId);

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl border border-stone-800 bg-stone-950/60 space-y-3 text-xs md:text-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-stone-400 text-xs">
                        Câu {idx + 1} • Chương {q.chapterId}
                      </span>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 className="h-4 w-4" /> Chính xác
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 text-xs font-semibold">
                          <XCircle className="h-4 w-4" /> Chưa chính xác
                        </span>
                      )}
                    </div>

                    <p className="font-semibold text-stone-200">{q.question}</p>

                    <div className="p-3 rounded-lg bg-stone-900/80 border border-stone-800 space-y-1">
                      <div className="text-stone-400">
                        <strong className="text-stone-300">Bạn đã chọn: </strong>
                        {chosenOption ? chosenOption.text : 'Chưa chọn'}
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-400 pt-1 border-t border-stone-800/80">
                          <strong>Đáp án chuẩn Mácxít: </strong>
                          {q.options.find((o) => o.id === q.correctOptionId)?.text}
                        </div>
                      )}
                    </div>

                    <div className="text-stone-400 leading-relaxed text-xs">
                      <strong className="text-amber-400">Giải thích: </strong>
                      {q.explanation.marxistCore}
                    </div>

                    <div className="text-[11px] text-stone-500 font-mono">
                      Nguồn: {q.explanation.textbookRef.curriculum} — Chương {q.explanation.textbookRef.chapter}, {q.explanation.textbookRef.section} (Trang {q.explanation.textbookRef.page})
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-4 pt-6">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border border-stone-800 bg-stone-900 hover:bg-stone-800 text-stone-300 text-sm font-semibold transition-colors"
          >
            Trang Chủ
          </Link>
          <Link
            href="/quiz?mode=exam"
            className="px-6 py-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-950/50"
          >
            Thử Thách Lại Bài Thi
          </Link>
        </div>
      </div>
    </main>
  );
}
