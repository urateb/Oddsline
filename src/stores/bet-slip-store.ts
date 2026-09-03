import { create } from 'zustand';

import type { BetSlipBetType, BetSlipSelection } from '@/types/bet-slip';

interface BetSlipState {
  selections: BetSlipSelection[];
  betType: BetSlipBetType;
  maxSelections: number;

  toggleSelection: (selection: BetSlipSelection) => void;
  removeSelection: (selectionId: string) => void;
  setBetType: (betType: BetSlipBetType) => void;
  setMaxSelections: (max: number) => void;
  clear: () => void;
}

export const useBetSlipStore = create<BetSlipState>()((set) => ({
  selections: [],
  betType: 'accumulator',
  maxSelections: 20,

  toggleSelection: (selection) =>
    set((state) => {
      const exists = state.selections.some(
        (item) => item.selectionId === selection.selectionId,
      );

      if (exists) {
        return {
          selections: state.selections.filter(
            (item) => item.selectionId !== selection.selectionId,
          ),
        };
      }

      if (state.selections.length >= state.maxSelections) {
        return state;
      }

      return { selections: [...state.selections, selection] };
    }),

  removeSelection: (selectionId) =>
    set((state) => ({
      selections: state.selections.filter(
        (item) => item.selectionId !== selectionId,
      ),
    })),

  setBetType: (betType) => set({ betType }),
  setMaxSelections: (maxSelections) => set({ maxSelections }),
  clear: () => set({ selections: [] }),
}));

export function selectIsSelectionActive(selectionId: string) {
  return (state: BetSlipState) =>
    state.selections.some((item) => item.selectionId === selectionId);
}
