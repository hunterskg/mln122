import React from 'react';
import { useGameStore } from '@/store/game-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { EmptyState } from '@/components/ui/feedback';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Boxes, Clock, Layers } from 'lucide-react';

export function InventoryScreen() {
  const { gameState } = useGameStore();

  if (!gameState) return null;

  const totalStock = gameState.inventory.lots.reduce((acc, lot) => acc + lot.units, 0);
  const totalValuation = gameState.inventory.lots.reduce((acc, lot) => acc + lot.units * lot.unitCost, 0);
  const excessStock = Math.max(0, totalStock - 500);

  return (
    <div className="space-y-6">
      {/* Inventory Valuation Header */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Tồn kho khả dụng</div>
          <div className="text-2xl font-black text-slate-100 mt-1">{formatNumber(totalStock)} đơn vị</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Hàng hóa sẵn sàng xuất bán</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Định giá kho (FIFO)</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">{formatCurrency(totalValuation)}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Tư bản hàng hóa nằm trong lưu thông</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Đơn hàng đang về kho</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">
            {gameState.inventory.purchaseOrders.length} Lô hàng
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">Đang trên đường vận chuyển</div>
        </Card>

        <Card>
          <div className="text-xs font-semibold text-slate-400 uppercase">Phí lưu kho vượt mức</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {formatCurrency(excessStock * gameState.inventory.holdingCostPerUnit)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {excessStock > 0 ? `Vượt ${formatNumber(excessStock)} đơn vị so với hạn mức 500` : 'Trong hạn mức kho tiêu chuẩn'}
          </div>
        </Card>
      </div>

      {/* FIFO Inventory Lots Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <CardTitle>Danh sách Lô hàng Tồn kho (Nguyên tắc FIFO)</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Xuất kho theo thứ tự: Lô nhập trước được bán trước</span>
        </CardHeader>
        <CardContent>
          {gameState.inventory.lots.length === 0 ? (
            <EmptyState
              icon={Boxes}
              title="Kho hàng đã cạn kiệt"
              description="Doanh nghiệp hiện không còn hàng tồn trong kho. Mọi nhu cầu mua hàng sẽ bị thiếu hụt cho đến khi có lô hàng mới cập bến."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã lô hàng</TableHead>
                  <TableHead>Tháng nhập kho</TableHead>
                  <TableHead>Số lượng còn lại</TableHead>
                  <TableHead>Giá vốn nhập (c)</TableHead>
                  <TableHead className="text-right">Giá trị sổ sách của lô</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameState.inventory.lots.map((lot) => (
                  <TableRow key={lot.id}>
                    <TableCell className="font-mono text-slate-300 font-semibold">{lot.id}</TableCell>
                    <TableCell>Tháng {lot.arrivalTurn}</TableCell>
                    <TableCell className="font-bold text-slate-100">{formatNumber(lot.units)} đơn vị</TableCell>
                    <TableCell>{formatCurrency(lot.unitCost)}</TableCell>
                    <TableCell className="text-right font-mono text-emerald-400">
                      {formatCurrency(lot.units * lot.unitCost)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* In-Transit Pipeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-400" />
            <CardTitle>Đơn hàng đang trong quá trình vận chuyển</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Thời gian tư bản lưu thông di chuyển về kho</span>
        </CardHeader>
        <CardContent>
          {gameState.inventory.purchaseOrders.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500 italic">
              Hiện không có đơn đặt hàng nào đang trên đường vận chuyển.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã đơn hàng</TableHead>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Tháng đặt</TableHead>
                  <TableHead>Điều khoản thanh toán</TableHead>
                  <TableHead className="text-right">Dự kiến nhập kho</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gameState.inventory.purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-mono">{po.id}</TableCell>
                    <TableCell className="font-semibold text-slate-200">{po.supplierId}</TableCell>
                    <TableCell>{formatNumber(po.units)} đơn vị</TableCell>
                    <TableCell>Tháng {po.orderedTurn}</TableCell>
                    <TableCell className="font-mono uppercase">{po.paymentTerms === 'immediate' ? 'Trả ngay' : 'Net-30'}</TableCell>
                    <TableCell className="text-right font-bold text-indigo-400">
                      Tháng {po.deliveryTurn} (còn {Math.max(0, po.deliveryTurn - gameState.turn)} tháng)
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
