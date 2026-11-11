import React from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { KpiCards } from '@/components/dashboard/kpi-cards';
import { AnalyticsChart } from '@/components/dashboard/analytics-chart';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/feedback';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { ArrowUpRight, CheckCircle2, TrendingUp, Users, Package } from 'lucide-react';

export function DashboardScreen() {
  const { gameState } = useGameStore();
  const { setActiveScreen } = useUIStore();

  if (!gameState) return null;

  const lastReport = gameState.lastReport;

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <KpiCards state={gameState} />

      {/* Turn Operational Summary Banner */}
      {lastReport ? (
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <CardTitle>Báo cáo tóm tắt Tháng {lastReport.turn}</CardTitle>
            </div>
            <span className="text-xs text-slate-400">Kết quả kỳ điều hành vừa qua</span>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400 block">Nhu cầu thị trường</span>
                <span className="text-sm font-bold text-slate-100">{formatNumber(lastReport.unitsDemanded)} đơn vị</span>
              </div>
              <div>
                <span className="text-slate-400 block">Sản lượng đã bán</span>
                <span className="text-sm font-bold text-emerald-400">{formatNumber(lastReport.unitsSold)} đơn vị</span>
              </div>
              <div>
                <span className="text-slate-400 block">Cháy hàng thiếu cung</span>
                <span className="text-sm font-bold text-rose-400">{formatNumber(lastReport.stockoutUnits)} đơn vị</span>
              </div>
              <div>
                <span className="text-slate-400 block">Lợi nhuận ròng</span>
                <span
                  className={`text-sm font-bold ${
                    lastReport.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(lastReport.netIncome)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <EmptyState
          icon={TrendingUp}
          title="Kỳ vận hành Tháng 1 đang diễn ra"
          description="Bạn đang ở tháng khởi sự đầu tiên. Hãy kiểm tra giá bán, tiếp thị, đặt hàng từ nhà cung cấp và đội ngũ nhân sự trước khi bấm Kết thúc tháng."
        />
      )}

      {/* Quick Action Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:border-slate-700 transition cursor-pointer" onClick={() => setActiveScreen('market')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Chiến lược thị trường & Giá bán</span>
            <ArrowUpRight className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-sm font-bold text-slate-100">{formatCurrency(gameState.market.unitPrice)} / đơn vị</div>
          <p className="text-xs text-slate-400 mt-1">Ngân sách tiếp thị: {formatCurrency(gameState.market.marketingBudget)}</p>
        </Card>

        <Card className="hover:border-slate-700 transition cursor-pointer" onClick={() => setActiveScreen('inventory')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Tồn kho & Cung ứng</span>
            <Package className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-sm font-bold text-slate-100">
            {formatNumber(gameState.inventory.lots.reduce((acc, lot) => acc + lot.units, 0))} đơn vị sẵn có
          </div>
          <p className="text-xs text-slate-400 mt-1">
            {gameState.inventory.purchaseOrders.length} đơn hàng đang trên đường vận chuyển
          </p>
        </Card>

        <Card className="hover:border-slate-700 transition cursor-pointer" onClick={() => setActiveScreen('employees')}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Đội ngũ & Năng lực lao động</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-sm font-bold text-slate-100">{gameState.employees.length} Nhân sự chính thức</div>
          <p className="text-xs text-slate-400 mt-1">Năng lực sản xuất đã được cấu hình</p>
        </Card>
      </div>

      {/* Historical Financial Chart */}
      <AnalyticsChart state={gameState} />
    </div>
  );
}
