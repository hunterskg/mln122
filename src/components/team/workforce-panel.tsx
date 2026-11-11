import React, { useState } from 'react';
import { GameState, PlayerTurnActions } from '@/engine';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { formatCurrency } from '@/lib/utils';
import { GraduationCap, Info } from 'lucide-react';

export function WorkforcePanel({
  state,
  actions,
  onSetHire,
  onToggleFire,
  onToggleTrain,
}: {
  state: GameState;
  actions: PlayerTurnActions;
  onSetHire: (role: 'sales' | 'operations' | 'support', count: number) => void;
  onToggleFire: (id: string) => void;
  onToggleTrain?: (id: string) => void;
}) {
  const [inspectEmployee, setInspectEmployee] = useState<any | null>(null);

  return (
    <div className="bg-slate-900 border border-slate-800 p-4 rounded-lg space-y-4">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h3 className="text-sm font-bold text-slate-200">Tuyển dụng & Đào tạo Nâng cao tay nghề</h3>
        <span className="text-xs text-slate-400">
          Chi phí đào tạo: <strong className="text-emerald-400">{formatCurrency(500)}</strong> / khóa (+10 kỹ năng, +5 tinh thần)
        </span>
      </div>

      {/* Recruiter controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
          <div className="font-semibold text-slate-200">Chuyên viên Bán hàng & Tiếp thị</div>
          <div className="text-[11px] text-slate-400 mb-2.5">{formatCurrency(2200)}/tháng · Tăng tỷ lệ chuyển đổi khách hàng</div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Số lượng tuyển:</span>
            <input
              type="number"
              min="0"
              max="10"
              value={actions.hireCount.sales}
              onChange={(e) => onSetHire('sales', parseInt(e.target.value) || 0)}
              className="w-16 bg-slate-900 border border-slate-700 text-center text-slate-100 rounded p-1"
            />
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
          <div className="font-semibold text-slate-200">Lao động Vận hành & Sản xuất</div>
          <div className="text-[11px] text-slate-400 mb-2.5">{formatCurrency(1800)}/tháng · Mở rộng năng lực đóng gói và xuất xưởng (+350–530 đv/tháng)</div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Số lượng tuyển:</span>
            <input
              type="number"
              min="0"
              max="10"
              value={actions.hireCount.operations}
              onChange={(e) => onSetHire('operations', parseInt(e.target.value) || 0)}
              className="w-16 bg-slate-900 border border-slate-700 text-center text-slate-100 rounded p-1"
            />
          </div>
        </div>

        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs">
          <div className="font-semibold text-slate-200">Nhân viên Chăm sóc khách hàng</div>
          <div className="text-[11px] text-slate-400 mb-2.5">{formatCurrency(1500)}/tháng · Tăng độ thỏa mãn & giảm tỷ lệ khách hàng rời bỏ</div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Số lượng tuyển:</span>
            <input
              type="number"
              min="0"
              max="10"
              value={actions.hireCount.support}
              onChange={(e) => onSetHire('support', parseInt(e.target.value) || 0)}
              className="w-16 bg-slate-900 border border-slate-700 text-center text-slate-100 rounded p-1"
            />
          </div>
        </div>
      </div>

      {/* Current Team list with Training & Layoff Controls */}
      <div>
        <h4 className="text-xs font-semibold text-slate-400 mb-2">Danh sách Đội ngũ Nhân sự Hiện tại</h4>
        <div className="space-y-2 max-h-56 overflow-y-auto">
          {state.employees.map((emp) => {
            const isFired = actions.fireEmployeeIds.includes(emp.id);
            const isTrained = actions.trainEmployeeIds?.includes(emp.id);

            const roleLabels: Record<string, string> = {
              sales: 'Bán hàng',
              operations: 'Vận hành',
              support: 'CSKH',
            };

            return (
              <div
                key={emp.id}
                className={`flex justify-between items-center text-xs p-2.5 rounded-lg border transition ${
                  isFired
                    ? 'bg-rose-950/20 border-rose-900/50 line-through text-slate-500'
                    : 'bg-slate-950 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setInspectEmployee(emp)}
                    className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                    title="Hồ sơ nhân sự"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                  <div>
                    <span className="font-semibold text-slate-200">{emp.name}</span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      ({roleLabels[emp.role] || emp.role}) · Kỹ năng: <strong className="text-slate-200">{emp.skill}%</strong> · Tinh thần:{' '}
                      <strong className={emp.morale > 60 ? 'text-emerald-400' : 'text-amber-400'}>{emp.morale}%</strong>{' '}
                      · Lương: {formatCurrency(emp.salary)}/tháng
                    </span>
                    {emp.trainingLevel > 0 && (
                      <span className="ml-2 text-[10px] bg-indigo-950 border border-indigo-700 text-indigo-300 px-1.5 py-0.5 rounded">
                        Chứng chỉ Cấp {emp.trainingLevel}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {onToggleTrain && emp.id !== 'emp_founder' && emp.trainingLevel < 3 && !isFired && (
                    <Button
                      size="sm"
                      variant={isTrained ? 'primary' : 'outline'}
                      onClick={() => onToggleTrain(emp.id)}
                      className="text-xs py-1 px-2 h-7"
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      {isTrained ? `Đã đăng ký (${formatCurrency(500)})` : 'Đào tạo'}
                    </Button>
                  )}

                  {emp.id !== 'emp_founder' && (
                    <Button
                      size="sm"
                      variant={isFired ? 'secondary' : 'danger'}
                      onClick={() => onToggleFire(emp.id)}
                      className="text-xs py-1 px-2 h-7"
                    >
                      {isFired ? 'Hủy sa thải' : 'Sa thải'}
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Employee Dossier Modal */}
      {inspectEmployee && (
        <Modal
          isOpen={!!inspectEmployee}
          onClose={() => setInspectEmployee(null)}
          title={`Hồ sơ nhân sự: ${inspectEmployee.name}`}
          description={`Vị trí chuyên trách: ${inspectEmployee.role}`}
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Mức lương cơ bản hàng tháng:</span>
              <span className="font-bold text-slate-100">{formatCurrency(inspectEmployee.salary)}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Trình độ tay nghề (Chất lượng lao động):</span>
              <span className="font-bold text-emerald-400">{inspectEmployee.skill} / 100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Tinh thần & Động lực làm việc:</span>
              <span className="font-bold text-slate-100">{inspectEmployee.morale}% (Nguy cơ nghỉ việc: &lt; 25%)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Cấp độ chứng chỉ đào tạo hoàn thành:</span>
              <span className="font-bold text-indigo-400">{inspectEmployee.trainingLevel} / 3</span>
            </div>
            <p className="text-[11px] text-slate-500 pt-1">
              Nhân sự có tinh thần dưới 25% có 35% nguy cơ tự nộp đơn thôi việc vào cuối tháng do kiệt sức hoặc bất mãn.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
}
