export type ScreenId =
  | 'menu'
  | 'setup'
  | 'dashboard'
  | 'financials'
  | 'suppliers'
  | 'inventory'
  | 'employees'
  | 'market'
  | 'events'
  | 'history'
  | 'report'
  | 'saves';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
}
