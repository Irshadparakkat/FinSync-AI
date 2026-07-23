import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  /** Desktop sidebar collapsed to icon rail. */
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
}

/**
 * Global client UI state (Zustand per the state-split rule). Persisted so
 * the user's sidebar preference survives reloads. Mobile drawer open/close
 * is transient and stays local to AppLayout.
 */
export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
    }),
    { name: 'finsync-ui' },
  ),
);
