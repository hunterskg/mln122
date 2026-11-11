import React, { useState } from 'react';
import {
  LayoutDashboard,
  DollarSign,
  Truck,
  Boxes,
  Users,
  LineChart,
  BellRing,
  History,
  FileCheck2,
  Home,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Save,
  HelpCircle,
} from 'lucide-react';
import { useUIStore } from '@/store/ui-store';
import { useGameStore } from '@/store/game-store';
import { ScreenId } from '@/types/ui';
import { cn, formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { TutorialModal } from '@/components/guide/tutorial-modal';

const NAV_ITEMS: { id: ScreenId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard },
  { id: 'financials', label: 'Báo cáo tài chính', icon: DollarSign },
  { id: 'suppliers', label: 'Nhà cung cấp & Đơn hàng', icon: Truck },
  { id: 'inventory', label: 'Hàng tồn kho (FIFO)', icon: Boxes },
  { id: 'employees', label: 'Quản trị nhân sự', icon: Users },
  { id: 'market', label: 'Thị trường & Định giá', icon: LineChart },
  { id: 'events', label: 'Lịch sử sự kiện', icon: BellRing },
  { id: 'history', label: 'Sổ cái công ty', icon: History },
  { id: 'report', label: 'Báo cáo tổng kết', icon: FileCheck2 },
  { id: 'saves', label: 'Lưu / Tải game', icon: Save },
];

export function Header() {
  const { gameState, advanceTurn } = useGameStore();
  const { toggleSidebar, setActiveScreen } = useUIStore();
  const [showManual, setShowManual] = useState(false);

  if (!gameState) return null;

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            aria-label="Toggle navigation menu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-sm text-slate-100 tracking-tight">{gameState.company?.name || 'Venture'}</span>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 hidden sm:inline-block">
              {gameState.company?.industry || 'industry'} · {gameState.company?.businessModel || 'model'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Manual button */}
          <button
            onClick={() => setShowManual(true)}
            title="Mở Cẩm nang & Hướng dẫn khởi nghiệp"
            aria-label="Mở Cẩm nang khởi nghiệp"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Quick Save button */}
          <button
            onClick={() => setActiveScreen('saves')}
            title="Lưu / Tải dữ liệu trò chơi"
            aria-label="Lưu hoặc tải dữ liệu"
            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition"
          >
            <Save className="w-4 h-4" />
          </button>

          {/* Month indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Kỳ vận hành:</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">
              Tháng {gameState.turn} <span className="text-slate-500 font-normal">/ 36</span>
            </span>
          </div>

          {/* Cash badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg">
            <span className="text-xs text-slate-400 font-medium">Tiền mặt:</span>
            <span
              className={cn(
                'text-xs font-bold font-mono',
                gameState.financial.cash < 0 ? 'text-rose-400' : 'text-slate-100'
              )}
            >
              {formatCurrency(gameState.financial.cash)}
            </span>
          </div>

          {/* Turn Step Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={() => advanceTurn()}
            disabled={gameState.isGameOver}
            aria-label="Kết thúc tháng và sang kỳ tiếp theo"
            className="flex items-center gap-1 shadow-md shadow-emerald-500/10 text-xs"
          >
            <span>Kết thúc tháng</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </header>
      <TutorialModal isOpen={showManual} onClose={() => setShowManual(false)} />
    </>
  );
}

export function Sidebar() {
  const { gameState } = useGameStore();
  const { activeScreen, setActiveScreen, sidebarOpen, toggleSidebar } = useUIStore();

  if (!gameState) return null;

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed lg:sticky top-0 lg:top-[57px] bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out h-screen lg:h-[calc(100vh-57px)]',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="p-4 space-y-1">
          <div className="flex items-center justify-between mb-4 px-2 lg:hidden">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">Quản trị</span>
            <button onClick={toggleSidebar} className="text-slate-400 hover:text-slate-200">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] font-bold text-slate-500 tracking-wider uppercase px-3 py-1">
            Nghiệp vụ vận hành
          </div>

          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveScreen(item.id);
                  if (window.innerWidth < 1024) toggleSidebar();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer text-left',
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-emerald-400' : 'text-slate-400')} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Menu quick exit */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={() => setActiveScreen('menu')}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition"
          >
            <Home className="w-4 h-4" />
            <span>Menu chính</span>
          </button>
        </div>
      </aside>
    </>
  );
}
