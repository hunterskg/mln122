import React, { useState } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { INDUSTRY_CONFIG, SupplierState } from '@/engine';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Modal } from '@/components/ui/modal';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Truck, ShoppingCart, Info } from 'lucide-react';

export function SuppliersScreen() {
  const {
    gameState,
    currentActions,
    addPurchaseOrder,
    removePurchaseOrder,
    selectPreferredSupplier,
  } = useGameStore();
  const { addToast } = useUIStore();
  const cfg = INDUSTRY_CONFIG[gameState?.company.industry || 'coffee'];

  const [selectedSupplierId, setSelectedSupplierId] = useState(
    gameState?.inventory.selectedSupplierId || cfg.suppliers[0]?.id || ''
  );
  const [detailModalSupplier, setDetailModalSupplier] = useState<SupplierState | null>(null);
  const [units, setUnits] = useState(100);

  if (!gameState) return null;

  const handleQueueOrder = () => {
    if (units <= 0) return;
    const sup = cfg.suppliers.find((s) => s.id === selectedSupplierId);
    if (!sup) return;

    if (units < sup.minOrderQuantity) {
      addToast({
        type: 'warning',
        title: 'Chưa đạt số lượng đặt hàng tối thiểu (MOQ)',
        description: `Nhà cung cấp này yêu cầu đặt hàng tối thiểu ${formatNumber(sup.minOrderQuantity)} đơn vị.`,
      });
      return;
    }

    addPurchaseOrder(selectedSupplierId, units);
    addToast({
      type: 'success',
      title: 'Đã lên đơn đặt hàng',
      description: `Đã đưa vào hàng chờ ${formatNumber(units)} đơn vị từ ${sup.name}. Đơn sẽ phát lệnh khi kết thúc tháng.`,
    });
  };

  const handleSetPrimary = (supId: string) => {
    selectPreferredSupplier(supId);
    setSelectedSupplierId(supId);
    addToast({
      type: 'info',
      title: 'Đã chọn nhà cung cấp chính',
      description: 'Đối tác cung ứng ưu tiên mặc định cho hoạt động sản xuất đã được cập nhật.',
    });
  };

  return (
    <div className="space-y-6">
      {/* Supplier Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-emerald-400" />
            <CardTitle>Danh mục Nhà cung cấp Vật tư Sản xuất</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Đánh đổi: Đơn giá tư bản c, thời gian vận chuyển và độ tin cậy giao hàng</span>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cfg.suppliers.map((sup) => {
              const effectiveCost =
                gameState.company.founderTrait === 'ops_veteran' ? Math.round(sup.unitCost * 0.85) : sup.unitCost;
              const isSelected = (currentActions.selectedSupplierId || gameState.inventory.selectedSupplierId) === sup.id;

              return (
                <div
                  key={sup.id}
                  className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/20 ring-1 ring-emerald-500'
                      : 'border-slate-800 bg-slate-950/60'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-sm text-slate-100">{sup.name}</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {formatCurrency(effectiveCost)}/đv
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-400">
                      <div className="flex justify-between">
                        <span>Thời gian giao hàng:</span>
                        <strong className="text-slate-200">{sup.leadTimeMonths} Tháng</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Độ tin cậy giao hàng:</span>
                        <strong className={sup.reliability >= 90 ? 'text-emerald-400' : 'text-amber-400'}>
                          {sup.reliability}%
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Điều khoản thanh toán:</span>
                        <strong className="text-slate-200 font-mono">
                          {sup.paymentTerms === 'immediate' ? 'TRẢ TIỀN NGAY' : 'NET-30 (BÁN CHỊU)'}
                        </strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Số lượng tối thiểu (MOQ):</span>
                        <strong className="text-slate-200">{formatNumber(sup.minOrderQuantity)} đơn vị</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetailModalSupplier(sup)}
                      className="w-1/2 text-xs"
                    >
                      <Info className="w-3.5 h-3.5" /> Chi tiết
                    </Button>
                    <Button
                      size="sm"
                      variant={isSelected ? 'primary' : 'secondary'}
                      onClick={() => handleSetPrimary(sup.id)}
                      className="w-1/2 text-xs"
                    >
                      {isSelected ? 'Đang ưu tiên' : 'Chọn đối tác'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Place Purchase Order Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-blue-400" />
            <CardTitle>Phát lệnh Đặt hàng Nguyên liệu (PO)</CardTitle>
          </div>
          <span className="text-xs text-slate-400">Bổ sung tư liệu sản xuất cho chu kỳ tới</span>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-3 items-end">
            <div className="w-full sm:w-1/2">
              <label className="text-xs text-slate-400 block mb-1">Nhà cung cấp lựa chọn</label>
              <select
                value={selectedSupplierId}
                onChange={(e) => setSelectedSupplierId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
              >
                {cfg.suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({formatCurrency(s.unitCost)}/đv · Giao {s.leadTimeMonths} tháng · {s.paymentTerms === 'immediate' ? 'Trả ngay' : 'Net-30'})
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full sm:w-1/4">
              <label className="text-xs text-slate-400 block mb-1">Số lượng đặt hàng (Đơn vị)</label>
              <input
                type="number"
                min="10"
                step="10"
                value={units}
                onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-2.5 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="w-full sm:w-1/4">
              <Button size="md" variant="primary" onClick={handleQueueOrder} className="w-full">
                Xác nhận đưa vào đơn hàng
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queued POs for this upcoming turn */}
      {currentActions.purchaseOrders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Đơn đặt hàng đang chờ phát lệnh cuối tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhà cung cấp</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Điều khoản</TableHead>
                  <TableHead>Tổng chi phí ước tính</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentActions.purchaseOrders.map((po, idx) => {
                  const s = cfg.suppliers.find((item) => item.id === po.supplierId);
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-semibold text-slate-200">{s?.name}</TableCell>
                      <TableCell>{formatNumber(po.units)} đơn vị</TableCell>
                      <TableCell className="font-mono uppercase">{s?.paymentTerms === 'immediate' ? 'Trả ngay' : 'Net-30'}</TableCell>
                      <TableCell>{formatCurrency(po.units * (s?.unitCost || 0))}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removePurchaseOrder(idx)}
                          className="text-rose-400 hover:text-rose-300"
                        >
                          Hủy bỏ
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Supplier Detail Modal */}
      {detailModalSupplier && (
        <Modal
          isOpen={!!detailModalSupplier}
          onClose={() => setDetailModalSupplier(null)}
          title={detailModalSupplier.name}
          description="Hồ sơ năng lực & Thông số kỹ thuật nhà cung cấp"
        >
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Đơn giá cơ sở:</span>
              <span className="font-bold text-slate-100">{formatCurrency(detailModalSupplier.unitCost)} / đơn vị</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Điểm chất lượng nguyên liệu:</span>
              <span className="font-bold text-slate-100">{detailModalSupplier.quality} / 100</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Độ tin cậy đúng hạn:</span>
              <span className="font-bold text-emerald-400">{detailModalSupplier.reliability}% tỷ lệ đúng hạn</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Thời gian chu chuyển (Lead Time):</span>
              <span className="font-bold text-slate-100">{detailModalSupplier.leadTimeMonths} Tháng</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800">
              <span className="text-slate-400">Kỳ hạn thanh toán:</span>
              <span className="font-bold text-slate-100 font-mono">
                {detailModalSupplier.paymentTerms === 'immediate' ? 'Thanh toán tiền mặt ngay' : 'Net-30 (Bán chịu 30 ngày)'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Định mức đặt hàng tối thiểu:</span>
              <span className="font-bold text-slate-100">{formatNumber(detailModalSupplier.minOrderQuantity)} đơn vị</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
