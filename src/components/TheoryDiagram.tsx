'use client';

import React from 'react';

interface TheoryDiagramProps {
  type?: 'value_structure' | 'dual_labor' | 'capital_circuit' | 'monopoly_price' | 'currency_circulation';
}

export function TheoryDiagram({ type }: TheoryDiagramProps) {
  if (!type) return null;

  if (type === 'value_structure') {
    return (
      <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Sơ đồ: Cấu trúc Lượng Giá Trị Hàng Hóa (W = c + v + m)
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-center text-xs">
          <div className="p-3 rounded-lg border border-stone-800 bg-stone-900/60 space-y-1">
            <span className="font-mono text-sm font-bold text-amber-400 block">c</span>
            <span className="font-semibold text-stone-200 block">Tư bản bất biến</span>
            <p className="text-[11px] text-stone-400">
              Máy móc, nhà xưởng, nguyên liệu. Giá trị cũ được chuyển dịch nguyên vẹn vào sản phẩm.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-rose-900/60 bg-rose-950/20 space-y-1">
            <span className="font-mono text-sm font-bold text-rose-400 block">v</span>
            <span className="font-semibold text-rose-200 block">Tư bản khả biến</span>
            <p className="text-[11px] text-stone-400">
              Giá trị sức lao động sống. Tái tạo ra tiền lương của người công nhân.
            </p>
          </div>

          <div className="p-3 rounded-lg border border-emerald-900/60 bg-emerald-950/20 space-y-1">
            <span className="font-mono text-sm font-bold text-emerald-400 block">m</span>
            <span className="font-semibold text-emerald-200 block">Giá trị thặng dư</span>
            <p className="text-[11px] text-stone-400">
              Do lao động sống tạo thêm vượt quá thời gian tất yếu, bị nhà tư bản chiếm đoạt.
            </p>
          </div>
        </div>

        <div className="text-center text-[11px] text-stone-500 font-mono pt-1 border-t border-stone-900">
          W = c + (v + m) • Chỉ có (v) mới là nguồn gốc tạo sinh ra (m)
        </div>
      </div>
    );
  }

  if (type === 'dual_labor') {
    return (
      <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Sơ đồ: Tính Hai Mặt Của Lao Động Sản Xuất Hàng Hóa
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-stone-800 bg-stone-900/60 space-y-1.5">
            <div className="font-bold text-stone-200 uppercase tracking-wide">
              Lao động Cụ thể
            </div>
            <p className="text-stone-400 text-[11px]">
              Lao động dưới một hình thức nghề nghiệp nhất định, công cụ và đối tượng riêng.
            </p>
            <div className="text-amber-400 font-medium text-[11px]">
              → Tạo ra: Giá trị sử dụng (Công năng hàng hóa)
            </div>
          </div>

          <div className="p-3 rounded-lg border border-rose-900/60 bg-rose-950/20 space-y-1.5">
            <div className="font-bold text-rose-300 uppercase tracking-wide">
              Lao động Trừu tượng
            </div>
            <p className="text-stone-400 text-[11px]">
              Sự hao phí sức óc, thần kinh, bắp thịt của con người nói chung.
            </p>
            <div className="text-rose-400 font-medium text-[11px]">
              → Tạo ra: Giá trị hàng hóa (Lao động xã hội kết tinh)
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'capital_circuit') {
    return (
      <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Sơ đồ: Công Thức Tuần Hoàn Của Tư Bản Công Nghiệp
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 p-3 rounded-lg border border-stone-800 bg-stone-900/60 font-mono text-xs text-stone-300 text-center">
          <div className="p-2 rounded bg-stone-950 border border-stone-800 w-full sm:w-auto">
            <span className="text-amber-400 font-bold">Giai đoạn 1:</span> Lưu thông
            <div className="text-white mt-0.5">T — H (TLSX & SLĐ)</div>
          </div>

          <span className="text-stone-500 font-bold hidden sm:inline">→</span>

          <div className="p-2 rounded bg-rose-950/40 border border-rose-800/60 w-full sm:w-auto">
            <span className="text-rose-400 font-bold">Giai đoạn 2:</span> Sản xuất
            <div className="text-white mt-0.5">… SX … (H&apos;)</div>
          </div>

          <span className="text-stone-500 font-bold hidden sm:inline">→</span>

          <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 w-full sm:w-auto">
            <span className="text-emerald-400 font-bold">Giai đoạn 3:</span> Thực hiện m
            <div className="text-white mt-0.5">H&apos; — T&apos; (T + Δt)</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'monopoly_price') {
    return (
      <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Sơ đồ: Cơ Chế Giá Cả Độc Quyền & Chiếm Đoạt Giá Trị Thặng Dư
        </div>

        <div className="p-3 rounded-lg border border-stone-800 bg-stone-900/60 text-xs space-y-2">
          <div className="flex items-center justify-between text-stone-300">
            <span>Giá bán độc quyền cao</span>
            <span className="font-mono text-rose-400 font-bold">&gt; Giá trị hàng hóa</span>
          </div>
          <div className="flex items-center justify-between text-stone-300">
            <span>Giá mua độc quyền thấp</span>
            <span className="font-mono text-emerald-400 font-bold">&lt; Giá trị sức LĐ / nguyên liệu</span>
          </div>
          <p className="text-[11px] text-stone-500 pt-1 border-t border-stone-800">
            Hệ quả: Tổ chức độc quyền bòn rút giá trị thặng dư từ người lao động, doanh nghiệp nhỏ và người tiêu dùng.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'currency_circulation') {
    return (
      <div className="rounded-xl border border-stone-800 bg-stone-950/70 p-4 space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Sơ đồ: Quy Luật Lưu Thông Tiền Tệ của C.Mác
        </div>

        <div className="p-3 rounded-lg border border-stone-800 bg-stone-900/60 text-center font-mono text-xs space-y-1">
          <div className="text-base font-bold text-amber-400">
            M = (P × Q) / V
          </div>
          <p className="text-[11px] text-stone-400 font-sans">
            M: Lượng tiền cần thiết cho lưu thông | P: Mức giá cả | Q: Khối lượng hàng hóa | V: Tốc độ lưu thông của tiền
          </p>
        </div>
      </div>
    );
  }

  return null;
}
