import React, { useState } from 'react';
import { Play, Sparkles, BookOpen, RotateCcw, Dice5, ScrollText, History } from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TutorialModal } from '@/components/guide/tutorial-modal';
import { ConfirmModal } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils';

export function MainMenuScreen() {
  const { setActiveScreen } = useUIStore();
  const { lifeState, lifeStones, resetLife } = useGameStore();
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Subtle lacquer atmospheric warmth */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center space-y-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-1 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Mô phỏng Đời sống & Kinh tế chính trị Mác - Lênin</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-normal font-display text-ink tracking-tight">
            NHỊP ĐỜI
          </h1>
          <p className="text-sm font-medium text-muted leading-relaxed font-sans max-w-sm mx-auto">
            Bốc ngẫu nhiên một điểm xuất phát tại Việt Nam và đi qua từng ngã rẽ sinh kế thường nhật. Mỗi quyết định là một sự đánh đổi.
          </p>
        </div>

        <Card className="p-6 space-y-3 bg-paper-2 border-rule backdrop-blur-md shadow-2xl">
          {lifeState && !lifeState.isGameOver && (
            <Button
              size="lg"
              variant="primary"
              onClick={() => setActiveScreen('dashboard')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold border-none whitespace-nowrap overflow-hidden"
            >
              <Play className="w-5 h-5 fill-current shrink-0" />
              <span className="truncate">
                Tiếp tục ({lifeState.profile.ten} · {lifeState.profile.tuoi} tuổi)
              </span>
            </Button>
          )}

          {lifeState && lifeState.isGameOver && (
            <Button
              size="lg"
              variant="primary"
              onClick={() => setActiveScreen('report')}
              className="w-full flex items-center justify-center gap-2 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold border-none whitespace-nowrap overflow-hidden"
            >
              <ScrollText className="w-5 h-5 shrink-0" />
              <span className="truncate">Xem đúc kết cuộc đời ({lifeState.profile.ten})</span>
            </Button>
          )}

          <Button
            size="lg"
            variant={lifeState ? 'outline' : 'primary'}
            onClick={() => {
              resetLife();
              setActiveScreen('setup');
            }}
            className={`w-full flex items-center justify-center gap-2 py-3 font-bold whitespace-nowrap ${
              lifeState
                ? 'border-rule hover:border-accent text-ink'
                : 'bg-amber-500 hover:bg-amber-400 text-black border-none'
            }`}
          >
            <Dice5 className={`w-5 h-5 ${lifeState ? 'text-amber-400' : 'text-black'}`} />
            <span>Bốc cuộc đời mới (18 tuổi)</span>
          </Button>

          <Button
            size="md"
            variant="ghost"
            onClick={() => setShowTutorial(true)}
            className="w-full flex items-center justify-center gap-2 text-xs text-muted hover:text-ink whitespace-nowrap"
          >
            <BookOpen className="w-4 h-4 text-sky-400" />
            <span>Giới thiệu & Triết lý trò chơi</span>
          </Button>

          {lifeState && (
            <Button
              size="md"
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              <span>Xóa cuộc đời đang chơi</span>
            </Button>
          )}
        </Card>

        {/* Life Stones History */}
        {lifeStones.length > 0 && (
          <Card className="p-4 bg-paper-2 border-rule text-left space-y-2.5">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted">
              <History className="w-3.5 h-3.5 text-amber-400" />
              <span>Những kiếp người đã sống ({lifeStones.length})</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {lifeStones.slice(0, 5).map((stone) => (
                <div
                  key={stone.id}
                  className="p-2.5 rounded-lg bg-paper border border-rule-subtle text-[11px] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <div className="font-bold text-ink truncate">
                      {stone.ten} ({stone.tuoiKetThuc} tuổi)
                    </div>
                    <div className="text-[10px] text-muted truncate">
                      {stone.diaPhuong} · {stone.lyDoKetThuc}
                    </div>
                  </div>
                  <span className="font-mono text-emerald-300 font-semibold shrink-0">
                    {formatCurrency(stone.tienMat)}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="text-[11px] text-muted flex justify-center gap-6">
          <span>Bối cảnh Việt Nam</span>
          <span>•</span>
          <span>Mô phỏng tất định PRNG</span>
          <span>•</span>
          <span>Không phán xét đạo đức</span>
        </div>
      </div>

      <TutorialModal isOpen={showTutorial} onClose={() => setShowTutorial(false)} />
      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          resetLife();
        }}
        title="Xác nhận xóa tiến trình"
        message="Bạn có chắc chắn muốn xóa tiến trình cuộc đời hiện tại không? Mọi lựa chọn và điểm số của nhân vật sẽ bị xóa bỏ."
        confirmText="Xóa tiến trình"
        cancelText="Hủy bỏ"
        variant="danger"
      />
    </div>
  );
}
