import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Sparkles,
  Heart,
  Scale,
  Brain,
  Users,
  Compass,
  X,
} from 'lucide-react';

export function TutorialModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <Card className="max-w-2xl w-full max-h-[85vh] overflow-y-auto bg-paper-2 border-rule shadow-2xl">
        <CardHeader className="border-b border-rule-subtle pb-3 flex flex-row items-center justify-between sticky top-0 bg-paper-2 z-10">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <CardTitle className="text-base sm:text-lg text-ink font-normal font-display">
              Giới thiệu & Triết lý Trò chơi: Nhịp Đời
            </CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted hover:text-ink hover:bg-paper-3 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent className="space-y-4 pt-4 text-xs text-ink-2 leading-relaxed font-sans">
          {/* Core Concept */}
          <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-xl space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Luận đề sinh kế cốt lõi</span>
            </div>
            <div className="text-ink leading-relaxed font-body text-[13px]">
              Điều kiện sinh tồn vật chất và vị trí trong quan hệ sản xuất quy định sâu sắc các lựa chọn của mỗi con người. Mọi quyết định phân bổ thời gian, sức lao động và tích lũy đều mang tính đánh đổi tất yếu giữa lợi ích vật chất trước mắt và giá trị nhân bản lâu dài.
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-paper rounded-xl border border-rule-subtle space-y-1">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Lá thăm cuộc đời (Lottery of Birth)</span>
              </div>
              <p className="text-muted">
                Không ai được tự chọn nơi mình sinh ra. Bạn sẽ khởi đầu ngẫu nhiên từ nông thôn nghèo, gia đình công nhân đô thị hay hộ buôn bán nhỏ ở các vùng miền trên khắp Việt Nam.
              </p>
            </div>

            <div className="p-3 bg-paper rounded-xl border border-rule-subtle space-y-1">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Scale className="w-4 h-4 text-sky-400" />
                <span>Không có lựa chọn "đúng tuyệt đối"</span>
              </div>
              <p className="text-muted">
                Mọi ngã rẽ đều có cái giá: Cày cuốc tăng ca giúp ví tiền đầy hơn nhưng hao mòn sức khỏe sinh học; giữ gìn cơ thể thì tích lũy mỏng; dốc lòng vì gia đình thì đôi khi phải gác lại ước mơ riêng.
              </p>
            </div>

            <div className="p-3 bg-paper rounded-xl border border-rule-subtle space-y-1">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-400" />
                <span>Giới hạn sinh học & Hao mòn thể lực</span>
              </div>
              <p className="text-muted">
                Sức lao động không phải là vô tận. Nếu để sức khỏe chạm đáy, nhân vật có thể kiệt sức hoặc kết thúc cuộc đời sớm trước tuổi già.
              </p>
            </div>

            <div className="p-3 bg-paper rounded-xl border border-rule-subtle space-y-1">
              <div className="font-bold text-ink flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-400" />
                <span>Ký ức & Dòng chảy hệ quả</span>
              </div>
              <p className="text-muted">
                Các quyết định trong quá khứ không biến mất. Chúng để lại các dấu ấn ký ức, kích hoạt những cảnh đời về sau: sự tương trợ của anh em hay bẫy tín dụng nợ nần.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-paper border border-rule-subtle rounded-xl space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>Góc nhìn Kinh tế chính trị Mác - Lênin</span>
            </div>
            <div className="text-ink-2 leading-relaxed text-[13px]">
              Trò chơi không giáo điều hay phán xét đạo đức. Cuối mỗi cuộc đời, hệ thống sẽ mở ra tấm gương đúc kết, giúp bạn chiêm nghiệm lại những lát cắt nhân sinh và nhận ra các quy luật kinh tế chính trị đang vận hành thầm lặng dưới từng lựa chọn thường nhật.
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              size="md"
              variant="primary"
              onClick={onClose}
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-bold border-none"
            >
              Đã hiểu, Bắt đầu khám phá Cuộc đời
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
