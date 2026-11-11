'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { Header, Sidebar } from '@/components/layout/game-layout';
import { ToastContainer } from '@/components/ui/toast-container';

// Screens
import { MainMenuScreen } from '@/components/screens/main-menu-screen';
import { SetupScreen } from '@/components/screens/setup-screen';
import { DashboardScreen } from '@/components/screens/dashboard-screen';
import { FinancialsScreen } from '@/components/screens/financials-screen';
import { SuppliersScreen } from '@/components/screens/suppliers-screen';
import { InventoryScreen } from '@/components/screens/inventory-screen';
import { EmployeesScreen } from '@/components/screens/employees-screen';
import { MarketOverviewScreen } from '@/components/screens/market-overview-screen';
import { EventHistoryScreen } from '@/components/screens/event-history-screen';
import { CompanyHistoryScreen } from '@/components/screens/company-history-screen';
import { FinalReportScreen } from '@/components/screens/final-report-screen';
import { SavesScreen } from '@/components/screens/saves-screen';

export default function Home() {
  const { gameState, resetGame } = useGameStore();
  const { activeScreen, setActiveScreen } = useUIStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Sanitize stale or incomplete save states
    if (gameState && (!gameState.company || !gameState.company.name)) {
      resetGame();
      setActiveScreen('menu');
      return;
    }
    // If state exists and currently on menu, default to dashboard if continuing
    if (!gameState && activeScreen !== 'setup' && activeScreen !== 'saves') {
      setActiveScreen('menu');
    }
  }, [gameState, activeScreen, setActiveScreen, resetGame]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-500 text-xs font-mono">
        Đang khởi tạo hệ thống...
      </div>
    );
  }

  // Standalone full-screen modes (no header/sidebar)
  if (activeScreen === 'menu' || activeScreen === 'setup' || (activeScreen === 'saves' && !gameState)) {
    return (
      <>
        {activeScreen === 'setup' && <SetupScreen />}
        {activeScreen === 'saves' && (
          <div className="min-h-screen bg-slate-950 p-6 flex flex-col justify-center">
            <SavesScreen />
          </div>
        )}
        {activeScreen === 'menu' && <MainMenuScreen />}
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
      <Header />
      <div className="flex-1 flex">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-y-auto">
          {activeScreen === 'dashboard' && <DashboardScreen />}
          {activeScreen === 'financials' && <FinancialsScreen />}
          {activeScreen === 'suppliers' && <SuppliersScreen />}
          {activeScreen === 'inventory' && <InventoryScreen />}
          {activeScreen === 'employees' && <EmployeesScreen />}
          {activeScreen === 'market' && <MarketOverviewScreen />}
          {activeScreen === 'events' && <EventHistoryScreen />}
          {activeScreen === 'history' && <CompanyHistoryScreen />}
          {activeScreen === 'report' && <FinalReportScreen />}
          {activeScreen === 'saves' && <SavesScreen />}
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}
