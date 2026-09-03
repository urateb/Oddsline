import { create } from 'zustand';

interface UiState {
  isBetSlipOpen: boolean;
  isRgBannerDismissed: boolean;

  setBetSlipOpen: (open: boolean) => void;
  dismissRgBanner: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isBetSlipOpen: false,
  isRgBannerDismissed: false,

  setBetSlipOpen: (open) => set({ isBetSlipOpen: open }),
  dismissRgBanner: () => set({ isRgBannerDismissed: true }),
}));
