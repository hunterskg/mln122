import React, { useState, useEffect } from 'react';
import { useGameStore } from '@/store/game-store';
import { useUIStore } from '@/store/ui-store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { listSaveSlots, SaveMetadata, exportSaveToJson } from '@/engine';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
  Save,
  FolderOpen,
  Trash2,
  Download,
  Upload,
  ArrowLeft,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

const SLOTS = [
  { id: 'autosave', label: 'Vị trí Tự động lưu (Autosave)', isAutosave: true },
  { id: 'slot_1', label: 'Vị trí Lưu thủ công 1', isAutosave: false },
  { id: 'slot_2', label: 'Vị trí Lưu thủ công 2', isAutosave: false },
  { id: 'slot_3', label: 'Vị trí Lưu thủ công 3', isAutosave: false },
];

export function SavesScreen() {
  const { gameState, saveToSlot, loadFromSlot, deleteSlot, importSave } = useGameStore();
  const { setActiveScreen, addToast } = useUIStore();
  const [saveList, setSaveList] = useState<Record<string, SaveMetadata | null>>({});
  const [showImport, setShowImport] = useState(false);
  const [importInput, setImportInput] = useState('');

  const refreshList = () => {
    const slots = listSaveSlots();
    const map: Record<string, SaveMetadata | null> = {};
    slots.forEach((s) => {
      map[s.id] = s;
    });
    setSaveList(map);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleSave = (slotId: string) => {
    if (!gameState) return;
    const ok = saveToSlot(slotId);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Lưu tiến trình thành công',
        description: `Dữ liệu công ty đã được ghi nhận vào vị trí [${slotId}].`,
      });
      refreshList();
    } else {
      addToast({
        type: 'error',
        title: 'Lỗi ghi nhớ dữ liệu',
        description: 'Không thể ghi dữ liệu trò chơi vào bộ nhớ trình duyệt.',
      });
    }
  };

  const handleLoad = (slotId: string) => {
    const ok = loadFromSlot(slotId);
    if (ok) {
      addToast({
        type: 'success',
        title: 'Khôi phục tiến trình thành công',
        description: 'Dữ liệu vận hành công ty đã sẵn sàng.',
      });
      setActiveScreen('dashboard');
    } else {
      addToast({
        type: 'error',
        title: 'Tải dữ liệu thất bại',
        description: 'Không tìm thấy dữ liệu hợp lệ hoặc tệp tin bị hỏng.',
      });
    }
  };

  const handleDelete = (slotId: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa dữ liệu lưu tại vị trí [${slotId}]?`)) return;
    deleteSlot(slotId);
    addToast({
      type: 'info',
      title: 'Đã xóa bản lưu',
      description: `Vị trí lưu [${slotId}] đã được giải phóng.`,
    });
    refreshList();
  };

  const handleExport = (slotId: string) => {
    const jsonStr = exportSaveToJson(slotId);
    if (!jsonStr) {
      addToast({ type: 'warning', title: 'Vị trí trống', description: 'Không có dữ liệu lưu nào để xuất tệp tin.' });
      return;
    }
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `startup_life_${slotId}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast({ type: 'success', title: 'Xuất tệp thành công', description: 'Đã tải xuống bản lưu dạng tệp JSON an toàn.' });
  };

  const handleImport = () => {
    if (!importInput.trim()) return;
    const res = importSave(importInput);
    if (res.success) {
      addToast({
        type: 'success',
        title: 'Nhập bản lưu thành công',
        description: 'Đã khôi phục trò chơi từ dữ liệu JSON. Đang chuyển tới Bảng điều khiển.',
      });
      setShowImport(false);
      setImportInput('');
      refreshList();
      setActiveScreen('dashboard');
    } else {
      addToast({
        type: 'error',
        title: 'Nhập bản lưu thất bại',
        description: res.error || 'Dữ liệu JSON không đúng định dạng chuẩn mực.',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            <Save className="w-5 h-5 text-emerald-400" />
            <span>Quản lý Vị trí Lưu & Tải Trò chơi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Lưu trữ tiến trình cục bộ an toàn (LocalStorage) và sao lưu tệp tin JSON
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowImport(!showImport)}
            className="flex items-center gap-1.5 text-xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Nhập tệp JSON</span>
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setActiveScreen(gameState ? 'dashboard' : 'menu')}
            className="flex items-center gap-1.5 text-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại</span>
          </Button>
        </div>
      </div>

      {/* JSON Import Section */}
      {showImport && (
        <Card className="border-indigo-500/30 bg-indigo-950/10">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-indigo-300">Nhập Dữ liệu Lưu trữ (Chuỗi JSON)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <textarea
              value={importInput}
              onChange={(e) => setImportInput(e.target.value)}
              placeholder="Dán nội dung tệp tin JSON bản lưu vào đây..."
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-3 font-mono focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setShowImport(false)}>
                Hủy bỏ
              </Button>
              <Button size="sm" variant="primary" onClick={handleImport}>
                Xác nhận khôi phục
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Slots List */}
      <div className="space-y-3">
        {SLOTS.map((slot) => {
          const meta = saveList[slot.id];
          const hasData = !!meta;

          return (
            <Card
              key={slot.id}
              className={`transition ${
                hasData ? 'border-slate-800 bg-slate-900/60' : 'border-slate-800/50 bg-slate-950/30'
              }`}
            >
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                {/* Slot Details */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-200">{slot.label}</span>
                    {slot.isAutosave && (
                      <span className="text-[10px] bg-emerald-950 border border-emerald-800 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-semibold">
                        TỰ ĐỘNG
                      </span>
                    )}
                  </div>

                  {hasData ? (
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                      <span className="font-bold text-slate-200">{meta.companyName}</span>
                      <span>•</span>
                      <span>Kỳ: <strong className="text-emerald-400 font-mono">Tháng {meta.turn} / 36</strong></span>
                      <span>•</span>
                      <span>Tiền mặt: <strong className="text-slate-200 font-mono">{formatCurrency(meta.cash)}</strong></span>
                      <span>•</span>
                      <span>Định giá: <strong className="text-indigo-400 font-mono">{formatCurrency(meta.valuation)}</strong></span>
                      <span>•</span>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(meta.timestamp)}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 italic pt-0.5">
                      Vị trí trống — Sẵn sàng ghi nhận dữ liệu
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {gameState && !slot.isAutosave && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSave(slot.id)}
                      className="text-xs flex items-center gap-1.5"
                    >
                      <Save className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ghi đè</span>
                    </Button>
                  )}

                  {hasData && (
                    <>
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleLoad(slot.id)}
                        className="text-xs flex items-center gap-1.5"
                      >
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>Tải bản lưu</span>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleExport(slot.id)}
                        title="Tải xuống tệp JSON dự phòng"
                        className="p-2 text-slate-400 hover:text-slate-100"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(slot.id)}
                        title="Xóa dữ liệu vị trí này"
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Safety Notice Footer */}
      <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Tiến trình tự động lưu được thực thi tại thời điểm kết thúc mỗi tháng. Mọi dữ liệu lưu trữ được bảo vệ an toàn bằng chuẩn kiểm tra tính hợp lệ dữ liệu trong LocalStorage của trình duyệt.
        </p>
      </div>
    </div>
  );
}
