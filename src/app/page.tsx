import Link from 'next/link';
import { BookOpen, Target, Award, ShieldCheck, ArrowRight } from 'lucide-react';
import chaptersData from '@/data/chapters.json';
import archetypesData from '@/data/archetypes.json';

export default function HomePage() {
  return (
    <main className="relative min-h-screen flex flex-col justify-between overflow-x-hidden">
      {/* Full-Screen Atmospheric Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover scale-110 filter blur-2xl brightness-[0.2] contrast-125"
        />
        <div className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/90" />
      </div>

      {/* Top Header / Brand Bar */}
      <header className="border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-rose-700 to-rose-950 flex items-center justify-center border border-rose-600/50 shadow-inner">
              <span className="font-black text-white text-base">ML</span>
            </div>
            <div>
              <span className="font-bold tracking-tight text-white block text-sm sm:text-base">
                Kinh Tế Chính Trị Mác - Lênin
              </span>
              <span className="text-[10px] text-stone-400 block tracking-wider uppercase">
                Diagnostic & Quiz Engine 2021
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-900 border border-stone-800 text-stone-300">
              <ShieldCheck className="h-3.5 w-3.5 text-rose-500" />
              Chuẩn Giáo trình Bộ GD&ĐT
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-stone-800/60">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-rose-950/25 via-stone-950 to-stone-950 -z-10" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-8">
          <div className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs font-semibold tracking-wide uppercase">
            Chuẩn mực tư duy — Thấu suốt bản chất quy luật kinh tế
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.15]">
            Bạn Tư Duy Như Một <br />
            <span className="bg-gradient-to-r from-rose-400 via-rose-500 to-amber-400 bg-clip-text text-transparent">
              Nhà Biện Chứng
            </span>{' '}
            Hay Bị Bẫy Bề Mặt?
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-stone-300 leading-relaxed font-light">
            Ứng dụng trắc nghiệm tình huống thực tế (săn sale, làm thêm OT, AI viết code, sốt đất, độc quyền nền tảng) giúp chẩn đoán thiên hướng tư duy và bóc tách các bẫy ngụy biện phổ biến trong môn Kinh tế chính trị.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/quiz?mode=practice"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white font-semibold text-base shadow-xl shadow-rose-950/50 transition-all flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>Luyện Tập Xem Giải Thích Ngay</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/quiz?mode=exam"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700/80 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Target className="h-4 w-4 text-amber-400" />
              <span>Thi Chẩn Đoán & Lập Radar Năng Lực</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4 Thinking Archetypes Preview */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 w-full space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            4 Hình Mẫu Tư Duy Trong Hệ Thống Chẩn Đoán
          </h2>
          <p className="text-sm text-stone-400 max-w-xl mx-auto">
            Hệ thống phân tích từng lựa chọn để định vị lăng kính kinh tế học của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {archetypesData.map((arch) => (
            <div
              key={arch.id}
              className="rounded-2xl border border-stone-800 bg-stone-900/60 overflow-hidden hover:border-stone-700 transition-all flex flex-col group"
            >
              {arch.imageUrl && (
                <div className="relative h-32 w-full overflow-hidden bg-stone-950">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={arch.imageUrl}
                    alt={arch.name}
                    className="w-full h-full object-cover brightness-[0.72] contrast-105 group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent" />
                  <div
                    className="absolute bottom-2 left-4 h-1 w-10 rounded-full"
                    style={{ backgroundColor: arch.accentColor }}
                  />
                </div>
              )}
              <div className="p-5 space-y-2 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">{arch.name}</h3>
                  <p className="text-xs text-amber-300/90 leading-relaxed italic">
                    &ldquo;{arch.tagline}&rdquo;
                  </p>
                </div>
                <p className="text-xs text-stone-400 line-clamp-3 pt-1">
                  {arch.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6 Chapters Roadmap */}
      <section className="py-16 border-t border-stone-800/80 bg-stone-950/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Bám Sát 6 Chương Giáo Trình Bộ GD&ĐT 2021
              </h2>
              <p className="text-sm text-stone-400 mt-1">
                Toàn bộ câu hỏi đều trích dẫn chính xác số chương, mục và cơ sở lý luận
              </p>
            </div>
            <Link
              href="/quiz?mode=practice"
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
            >
              Làm thử ngay <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {chaptersData.map((ch) => (
              <div
                key={ch.id}
                className="rounded-xl border border-stone-800/80 bg-stone-900/40 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-900">
                    Chương {ch.id}
                  </span>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {ch.recommendedPages.split('(')[0]}
                  </span>
                </div>
                <h4 className="font-semibold text-stone-200 text-sm line-clamp-1">
                  {ch.shortTitle}
                </h4>
                <p className="text-xs text-stone-400 line-clamp-2">
                  {ch.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-800 py-8 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 space-y-2">
          <p>
            Kinh Tế Chính Trị Mác - Lênin Quiz & Diagnostic Engine • Xây dựng theo chuẩn Giáo trình 2021
          </p>
          <p className="text-[11px] text-stone-600">
            Ứng dụng hỗ trợ học tập, rèn luyện tư duy biện chứng và chuẩn bị thi kết thúc học phần.
          </p>
        </div>
      </footer>
    </main>
  );
}
