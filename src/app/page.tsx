'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { ToastContainer } from '@/components/ui/toast-container';

// Screens
import { MainMenuScreen } from '@/components/screens/main-menu-screen';
import { SetupScreen } from '@/components/screens/setup-screen';
import { DashboardScreen } from '@/components/screens/dashboard-screen';
import { FinalReportScreen } from '@/components/screens/final-report-screen';
import { SavesScreen } from '@/components/screens/saves-screen';

export default function Home() {
  const { gameState, lifeState, resetGame } = useGameStore();
  const { activeScreen, setActiveScreen } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sanitize stale or incomplete enterprise save states
    if (gameState && (!gameState.company || !gameState.company.name)) {
      resetGame();
      setActiveScreen('menu');
      return;
    }
    // If neither state exists and currently on game screens, default to menu
    if (!gameState && !lifeState && activeScreen !== 'setup' && activeScreen !== 'saves') {
      setActiveScreen('menu');
    }
  }, [gameState, lifeState, activeScreen, setActiveScreen, resetGame]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center text-muted text-xs font-mono">
        Đang khởi tạo hệ thống...
      </div>
    );
  }

  // Standalone full-screen modes (menu / setup / standalone saves)
  if (activeScreen === 'menu' || activeScreen === 'setup' || (activeScreen === 'saves' && !gameState && !lifeState)) {
    return (
      <>
        {activeScreen === 'setup' && <SetupScreen />}
        {activeScreen === 'saves' && (
          <div className="min-h-screen bg-paper p-6 flex flex-col justify-center">
            <SavesScreen />
          </div>
        )}
        {activeScreen === 'menu' && <MainMenuScreen />}
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col antialiased">
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full overflow-y-auto">
        {activeScreen === 'dashboard' && <DashboardScreen />}
        {activeScreen === 'report' && <FinalReportScreen />}
        {activeScreen === 'saves' && <SavesScreen />}
      </main>
      <ToastContainer />
    </div>
  );
}
