import React from 'react';
import { useGameStore } from '@/store/game-store';
import { WorkforcePanel } from '@/components/team/workforce-panel';
import { Card } from '@/components/ui/card';
import { calculateLaborCapacity } from '@/engine';
import { formatCurrency, formatNumber } from '@/lib/utils';

export function EmployeesScreen() {
  const { gameState, currentActions, setHireCount, toggleFireEmployee, toggleTrainEmployee } = useGameStore();

  if (!gameState) return null;

  const totalSalaries = gameState.employees.reduce((acc, e) => acc + e.salary, 0);
  const avgMorale = Math.round(
    gameState.employees.reduce((acc, e) => acc + e.morale, 0) / Math.max(1, gameState.employees.length)
  );
  const laborCapacity = calculateLaborCapacity(gameState);

  return (
    <div className="space-y-6">
      {/* Team Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Quy mô nhân sự</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{gameState.employees.length} Nhân sự</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Lực lượng lao động hiện tại</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Quỹ lương hàng tháng (v)</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(totalSalaries)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Giá trị sức lao động cần chi trả</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Tinh thần lao động bình quân</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">{avgMorale}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">&lt; 25% có nguy cơ công nhân tự nghỉ việc</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Công suất sản xuất tối đa</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{formatNumber(laborCapacity)} đv/tháng</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Trần hoàn thành đơn hàng</div>
        </Card>
      </div>

      {/* Workforce Panel Component */}
      <WorkforcePanel
        state={gameState}
        actions={currentActions}
        onSetHire={setHireCount}
        onToggleFire={toggleFireEmployee}
        onToggleTrain={toggleTrainEmployee}
      />
    </div>
  );
}
