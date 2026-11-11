import React from 'react';
import { useGameStore } from '@/store/game-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/feedback';
import { MILESTONES, ACHIEVEMENTS } from '@/engine';
import { formatCurrency } from '@/lib/utils';
import { History, CheckCircle2, Trophy, Clock } from 'lucide-react';

export function CompanyHistoryScreen() {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  return (
    <div className="space-y-6">
      {/* Achievements & Milestones Shelf */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Milestones */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <CardTitle>Cột mốc Tăng trưởng Doanh nghiệp</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {MILESTONES.map((m) => {
                const unlocked = m.isUnlocked(gameState);
                return (
                  <div
                    key={m.id}
                    className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                      unlocked ? 'bg-emerald-950/20 border-emerald-800/60' : 'bg-slate-950/40 border-slate-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{m.title}</div>
                      <div className="text-[11px] text-slate-400">{m.description}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        unlocked ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-slate-500'
                      }`}
                    >
                      {unlocked ? 'Đã đạt' : 'Chưa đạt'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Corporate Achievements */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <CardTitle>Huy hiệu Thành tựu Kinh doanh</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {ACHIEVEMENTS.map((a) => {
                const unlocked = a.check(gameState);
                return (
                  <div
                    key={a.id}
                    className={`p-2.5 rounded-lg border text-xs flex justify-between items-center ${
                      unlocked ? 'bg-amber-950/20 border-amber-800/60' : 'bg-slate-950/40 border-slate-900 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-slate-200">{a.name}</div>
                      <div className="text-[11px] text-slate-400">{a.description}</div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                        unlocked ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'text-slate-500'
                      }`}
                    >
                      {unlocked ? 'Hoàn thành' : 'Đang chờ'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Financial Ledger Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            <CardTitle>Sổ cái Báo cáo Tài chính qua các Tháng</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Lưu trữ toàn bộ các kỳ điều hành đã qua</span>
        </CardHeader>
        <CardContent>
          {gameState.history.financials.length === 0 ? (
            <EmptyState
              icon={Clock}
              title="Chưa có dữ liệu lịch sử"
              description="Các bản ghi sổ cái tài chính sẽ được lưu lại sau khi bạn kết thúc mỗi tháng vận hành."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kỳ vận hành</TableHead>
                  <TableHead>Doanh thu</TableHead>
                  <TableHead>Giá vốn (c)</TableHead>
                  <TableHead>Lợi nhuận gộp</TableHead>
                  <TableHead>Chi phí HĐ</TableHead>
                  <TableHead>Lợi nhuận ròng</TableHead>
                  <TableHead>Tiền mặt cuối kỳ</TableHead>
                  <TableHead className="text-right">Định giá kho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameState.history.financials.map((h) => (
                  <TableRow key={h.turn}>
                    <TableCell className="font-bold text-slate-200">Tháng {h.turn}</TableCell>
                    <TableCell className="text-emerald-400 font-mono">{formatCurrency(h.revenue)}</TableCell>
                    <TableCell className="text-rose-400 font-mono">-{formatCurrency(h.cogs)}</TableCell>
                    <TableCell className="font-semibold text-slate-200 font-mono">{formatCurrency(h.grossProfit)}</TableCell>
                    <TableCell className="text-slate-400 font-mono">-{formatCurrency(h.opex)}</TableCell>
                    <TableCell
                      className={`font-bold font-mono ${
                        h.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCurrency(h.netIncome)}
                    </TableCell>
                    <TableCell
                      className={`font-mono ${
                        h.endingCash >= 0 ? 'text-slate-200' : 'text-rose-500 font-bold'
                      }`}
                    >
                      {formatCurrency(h.endingCash)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-slate-400">
                      {formatCurrency(h.inventoryValuation)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
