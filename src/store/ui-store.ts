import { create } from 'zustand';
import { ScreenId, ToastMessage } from '@/types/ui';

interface UIStore {
  activeScreen: ScreenId;
  sidebarOpen: boolean;
  toasts: ToastMessage[];
  setActiveScreen: (screen: ScreenId) => void;
  toggleSidebar: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  activeScreen: 'menu',
  sidebarOpen: true,
  toasts: [],
  setActiveScreen: (screen) => set({ activeScreen: screen }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 4000);
  },
  removeToast: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));
