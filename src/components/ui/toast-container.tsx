import React from 'react';
import { useUIStore } from '@/store/ui-store';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useUIStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: CheckCircle2,
          warning: AlertTriangle,
          info: Info,
          error: XCircle,
        };
        const Icon = icons[toast.type];

        const colors = {
          success: 'bg-emerald-950/90 border-emerald-500/50 text-emerald-200',
          warning: 'bg-amber-950/90 border-amber-500/50 text-amber-200',
          info: 'bg-slate-900/90 border-slate-700 text-slate-200',
          error: 'bg-rose-950/90 border-rose-500/50 text-rose-200',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-xl flex items-start gap-3 backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200 ${colors[toast.type]}`}
          >
            <Icon className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-xs">
              <div className="font-bold">{toast.title}</div>
              {toast.description && <div className="text-[11px] opacity-80 mt-0.5">{toast.description}</div>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-100 p-0.5 rounded transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
