import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, RotateCcw, Building2, Save } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TutorialModal } from '@/components/guide/tutorial-modal';

export function MainMenuScreen() {
  const { setActiveScreen } = useUIStore();
  const { gameState, resetGame } = useGameStore();
  const [showTutorial, setShowTutorial] = useState(false);

  return (
    <div className="min-h-screen bg-radial from-slate-900 to-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0a_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mô phỏng Kinh doanh & Kinh tế chính trị Mác - Lênin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-100 tracking-tight">
            STARTUP LIFE
          </h1>
          <p className="text-sm font-medium text-slate-400">
            Từ số không đến hưng thịnh. Làm chủ dòng tiền, quản trị lao động, chuỗi cung ứng và cạnh tranh thị trường.
          </p>
        </div>

        <Card className="p-6 space-y-3 bg-slate-900/80 border-slate-800 backdrop-blur-md shadow-2xl">
          {gameState && gameState.company && !gameState.isGameOver && (
            <Button
              size="lg"
              variant="primary"
              onClick={() => setActiveScreen('dashboard')}
              className="w-full flex items-center justify-center gap-2 py-3"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Tiếp tục ({gameState.company.name} · Tháng {gameState.turn})</span>
            </Button>
          )}

          <Button
            size="lg"
            variant={gameState && !gameState.isGameOver ? 'outline' : 'primary'}
            onClick={() => setActiveScreen('setup')}
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            <Building2 className="w-5 h-5" />
            <span>Thành lập công ty mới</span>
          </Button>

          <Button
            size="md"
            variant="secondary"
            onClick={() => setActiveScreen('saves')}
            className="w-full flex items-center justify-center gap-2 text-xs"
          >
            <Save className="w-4 h-4 text-emerald-400" />
            <span>Quản lý vị trí lưu & tải game</span>
          </Button>

          <Button
            size="md"
            variant="ghost"
            onClick={() => setShowTutorial(true)}
            className="w-full flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-200"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Cẩm nang khởi nghiệp & Quy luật kinh tế</span>
          </Button>

          {gameState && (
            <Button
              size="md"
              variant="ghost"
              onClick={() => {
                if (window.confirm('Bạn có chắc chắn muốn đặt lại và xóa tiến trình chơi hiện tại?')) {
                  resetGame();
                }
              }}
              className="w-full text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa tiến trình hiện tại</span>
            </Button>
          )}
        </Card>

        <div className="text-[11px] text-slate-500 flex justify-center gap-6">
          <span>Kế toán dồn tích & FIFO</span>
          <span>•</span>
          <span>Mô phỏng tất định PRNG</span>
          <span>•</span>
          <span>Quy luật giá trị Mác - Lênin</span>
        </div>
      </div>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
    </div>
  );
}
