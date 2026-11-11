import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './button';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-slate-800 bg-slate-950/40 my-3">
      <div className="p-3 bg-slate-900 rounded-full border border-slate-800 mb-3 text-slate-400">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-sm font-semibold text-slate-200">{title}</h4>
      <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingSpinner({ text = 'Đang tính toán mô phỏng chu kỳ tháng...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
      <div className="w-8 h-8 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
      <span className="text-xs font-medium text-slate-400">{text}</span>
    </div>
  );
}

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  description = 'Không thể hoàn thành thao tác.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="p-4 rounded-xl border border-rose-900/60 bg-rose-950/30 text-rose-200 text-xs space-y-2">
      <div className="font-bold text-sm text-rose-300">{title}</div>
      <p className="text-rose-400">{description}</p>
      {onRetry && (
        <Button variant="danger" size="sm" onClick={onRetry}>
          Thử lại
        </Button>
      )}
    </div>
  );
}
