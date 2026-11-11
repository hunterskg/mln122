import React, { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/feedback';
import { formatCurrency } from '@/lib/utils';
import { Landmark, Plus, Minus, ReceiptText } from 'lucide-react';

export function FinancialsScreen() {
  const { gameState, setBorrowDebt, setRepayDebt } = useGameStore();
  const { addToast } = useUIStore();
  const [borrowInput, setBorrowInput] = useState('');
  const [repayInput, setRepayInput] = useState('');

  if (!gameState) return null;

  const fin = gameState.history.financials[gameState.history.financials.length - 1];
  const allTransactions = [...gameState.history.transactions].reverse();

  const handleBorrow = () => {
    const val = parseInt(borrowInput) || 0;
    if (val <= 0) return;
    if (gameState.financial.debt + val > gameState.financial.creditLimit) {
      addToast({ type: 'error', title: 'Vượt quá hạn mức tín dụng', description: 'Không thể vay vượt hạn mức tối đa cho phép.' });
      return;
    }
    setBorrowDebt(val);
    setBorrowInput('');
    addToast({ type: 'success', title: 'Đã lên lệnh vay vốn', description: `Sẽ giải ngân ${formatCurrency(val)} khi kết thúc tháng.` });
  };

  const handleRepay = () => {
    const val = parseInt(repayInput) || 0;
    if (val <= 0) return;
    setRepayDebt(val);
    setRepayInput('');
    addToast({ type: 'info', title: 'Đã lên lịch trả nợ', description: `Sẽ trích tiền mặt trả ${formatCurrency(val)} khi kết thúc tháng.` });
  };

  return (
    <div className="space-y-6">
      {/* Top Solvency & Working Capital Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Số dư tiền mặt</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{formatCurrency(gameState.financial.cash)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Thanh khoản tức thời</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Dư nợ ngân hàng</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{formatCurrency(gameState.financial.debt)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hạn mức tối đa: {formatCurrency(gameState.financial.creditLimit)}</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Khoản phải thu (AR)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {formatCurrency(gameState.financial.pendingAR.reduce((acc, a) => acc + a.amount, 0))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hóa đơn bán chịu chờ khách trả</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Khoản phải trả (AP)</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(gameState.financial.pendingAP.reduce((acc, a) => acc + a.amount, 0))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Công nợ mua vật tư đến hạn</div>
        </Card>
      </div>

      {/* Credit Line Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-indigo-400" />
            <CardTitle>Quản trị Hạn mức Tín dụng & Chi phí Vốn vay</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Lãi suất vay thương mại: 1% mỗi tháng</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Rút vốn thấu chi</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Số tiền (₫)"
                  value={borrowInput}
                  onChange={(e) => setBorrowInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                />
                <Button size="sm" variant="secondary" onClick={handleBorrow} className="shrink-0">
                  <Plus className="w-3.5 h-3.5" /> Vay thêm
                </Button>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300 block">Trả bớt nợ gốc</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Số tiền (₫)"
                  value={repayInput}
                  onChange={(e) => setRepayInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 text-xs text-slate-100 rounded px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                />
                <Button size="sm" variant="secondary" onClick={handleRepay} className="shrink-0">
                  <Minus className="w-3.5 h-3.5" /> Trả nợ
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comprehensive Statement Breakdown */}
      {fin ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income Statement */}
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo Kết quả Kinh doanh (Dồn tích Tháng {fin.turn})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Doanh thu gộp</span>
                  <span className="font-semibold text-slate-100">{formatCurrency(fin.revenue)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Giá vốn hàng bán (FIFO - Tư bản bất biến c)</span>
                  <span className="text-rose-400">-{formatCurrency(fin.cogs)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-slate-200 bg-slate-950 px-2 rounded">
                  <span>Lợi nhuận gộp</span>
                  <span>{formatCurrency(fin.grossProfit)}</span>
                </div>

                <div className="pt-2 text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Tiền lương nhân sự (Tư bản khả biến v)</span>
                    <span>-{formatCurrency(fin.salaries)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chi phí mặt bằng cơ sở</span>
                    <span>-{formatCurrency(fin.rent)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chi phí tiếp thị & quảng bá</span>
                    <span>-{formatCurrency(fin.marketing)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chi phí lưu kho & bảo quản</span>
                    <span>-{formatCurrency(fin.holdingCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chi phí lãi vay tư bản (1%)</span>
                    <span>-{formatCurrency(fin.interest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Thuế thu nhập doanh nghiệp (20%)</span>
                    <span>-{formatCurrency(fin.tax)}</span>
                  </div>
                </div>

                <div className="flex justify-between py-2 border-t border-slate-700 text-sm font-black">
                  <span>Lợi nhuận ròng sau thuế</span>
                  <span className={fin.netIncome >= 0 ? 'text-emerald-400' : 'text-rose-500'}>
                    {formatCurrency(fin.netIncome)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cash Flow Statement */}
          <Card>
            <CardHeader>
              <CardTitle>Báo cáo Lưu chuyển Tiền tệ (Dòng tiền Tháng {fin.turn})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-800/80">
                  <span className="text-slate-400">Tiền mặt đầu kỳ</span>
                  <span className="text-slate-300 font-mono">{formatCurrency(fin.startingCash)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400">
                  <span>Tổng dòng tiền thực thu vào</span>
                  <span className="text-emerald-400 font-mono">+{formatCurrency(fin.cashReceipts)}</span>
                </div>
                <div className="flex justify-between py-1 text-slate-400 border-b border-slate-800/80">
                  <span>Tổng dòng tiền thực chi ra</span>
                  <span className="text-rose-400 font-mono">-{formatCurrency(fin.cashDisbursements)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold text-slate-200 bg-slate-950 px-2 rounded">
                  <span>Lưu chuyển tiền tệ ròng trong tháng</span>
                  <span className={fin.netCashFlow >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {fin.netCashFlow >= 0 ? '+' : ''}{formatCurrency(fin.netCashFlow)}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-t border-slate-700 text-sm font-black">
                  <span>Số dư tiền mặt cuối kỳ</span>
                  <span className={fin.endingCash >= 0 ? 'text-emerald-400' : 'text-rose-500'}>
                    {formatCurrency(fin.endingCash)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card className="text-center p-8 text-xs text-slate-500">
          Báo cáo tài chính chi tiết sẽ xuất hiện sau khi bạn hoàn thành Tháng 1.
        </Card>
      )}

      {/* Complete Historical Transaction Audit Log */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ReceiptText className="w-4 h-4 text-emerald-400" />
            <CardTitle>Nhật ký Sổ cái Giao dịch Kế toán</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Minh bạch dòng tiền, đối soát dồn tích chuẩn mực</span>
        </CardHeader>
        <CardContent>
          {allTransactions.length === 0 ? (
            <EmptyState
              icon={ReceiptText}
              title="Chưa có giao dịch phát sinh"
              description="Các giao dịch kế toán sẽ tự động ghi nhận khi chi trả tiền lương, đặt mua nguyên liệu, thu tiền bán hàng và thanh toán chi phí."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Kỳ</TableHead>
                  <TableHead>Phân loại</TableHead>
                  <TableHead>Nội dung giao dịch</TableHead>
                  <TableHead>Dòng tiền</TableHead>
                  <TableHead className="text-right">Tác động P&L</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allTransactions.slice(0, 25).map((tx) => (
                  <TableRow key={tx.id}>
                    <TableCell className="font-bold text-slate-300">T{tx.turn}</TableCell>
                    <TableCell className="font-mono text-[11px] text-slate-400">{tx.type}</TableCell>
                    <TableCell className="text-slate-200">{tx.description}</TableCell>
                    <TableCell
                      className={`font-mono font-bold ${
                        tx.cashImpact > 0
                          ? 'text-emerald-400'
                          : tx.cashImpact < 0
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {tx.cashImpact > 0 ? `+${formatCurrency(tx.cashImpact)}` : formatCurrency(tx.cashImpact)}
                    </TableCell>
                    <TableCell
                      className={`font-mono text-right ${
                        tx.profitImpact > 0
                          ? 'text-emerald-400'
                          : tx.profitImpact < 0
                          ? 'text-rose-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {tx.profitImpact > 0 ? `+${formatCurrency(tx.profitImpact)}` : formatCurrency(tx.profitImpact)}
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
