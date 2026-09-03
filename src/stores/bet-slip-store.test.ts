import { beforeEach, describe, expect, it } from 'vitest';

import type { BetSlipSelection } from '@/types/bet-slip';

import { selectIsSelectionActive, useBetSlipStore } from './bet-slip-store';

const selectionA: BetSlipSelection = {
  selectionId: 'sel_a',
  eventId: 'evt_1',
  eventName: 'Arsenal vs Manchester City',
  marketId: 'mkt_1',
  marketName: 'Match Winner',
  selectionName: 'Arsenal',
  label: '1',
  odds: 1.65,
};

const selectionB: BetSlipSelection = {
  ...selectionA,
  selectionId: 'sel_b',
  selectionName: 'Draw',
  label: 'X',
  odds: 4.2,
};

describe('bet slip store', () => {
  beforeEach(() => {
    useBetSlipStore.setState({
      selections: [],
      betType: 'accumulator',
      maxSelections: 20,
    });
  });

  it('starts empty', () => {
    expect(useBetSlipStore.getState().selections).toEqual([]);
  });

  it('adds a selection the first time it is toggled', () => {
    useBetSlipStore.getState().toggleSelection(selectionA);

    expect(useBetSlipStore.getState().selections).toEqual([selectionA]);
  });

  it('removes the selection when toggled a second time', () => {
    useBetSlipStore.getState().toggleSelection(selectionA);
    useBetSlipStore.getState().toggleSelection(selectionA);

    expect(useBetSlipStore.getState().selections).toEqual([]);
  });

  it('supports multiple simultaneous selections', () => {
    useBetSlipStore.getState().toggleSelection(selectionA);
    useBetSlipStore.getState().toggleSelection(selectionB);

    expect(useBetSlipStore.getState().selections).toHaveLength(2);
  });

  it('removes a specific selection by id without touching the others', () => {
    useBetSlipStore.getState().toggleSelection(selectionA);
    useBetSlipStore.getState().toggleSelection(selectionB);
    useBetSlipStore.getState().removeSelection(selectionA.selectionId);

    expect(useBetSlipStore.getState().selections).toEqual([selectionB]);
  });

  it('clears every selection', () => {
    useBetSlipStore.getState().toggleSelection(selectionA);
    useBetSlipStore.getState().toggleSelection(selectionB);
    useBetSlipStore.getState().clear();

    expect(useBetSlipStore.getState().selections).toEqual([]);
  });

  it('does not add selections beyond maxSelections', () => {
    useBetSlipStore.setState({ maxSelections: 1 });

    useBetSlipStore.getState().toggleSelection(selectionA);
    useBetSlipStore.getState().toggleSelection(selectionB);

    expect(useBetSlipStore.getState().selections).toEqual([selectionA]);
  });

  it('lets setBetType switch between single and accumulator', () => {
    useBetSlipStore.getState().setBetType('single');
    expect(useBetSlipStore.getState().betType).toBe('single');

    useBetSlipStore.getState().setBetType('accumulator');
    expect(useBetSlipStore.getState().betType).toBe('accumulator');
  });

  it('selectIsSelectionActive reflects whether a given selection is in the slip', () => {
    useBetSlipStore.getState().toggleSelection(selectionA);
    const state = useBetSlipStore.getState();

    expect(selectIsSelectionActive(selectionA.selectionId)(state)).toBe(true);
    expect(selectIsSelectionActive(selectionB.selectionId)(state)).toBe(false);
  });
});
