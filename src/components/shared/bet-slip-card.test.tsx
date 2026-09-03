import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { BetSlipSelection } from '@/types/bet-slip';

import { BetSlipCard } from './bet-slip-card';

const selection: BetSlipSelection = {
  selectionId: 'sel_001_h',
  eventId: 'evt_001',
  eventName: 'Arsenal vs Manchester City',
  marketId: 'mkt_001_1x2',
  marketName: 'Match Winner',
  selectionName: 'Arsenal',
  label: '1',
  odds: 1.65,
};

describe('BetSlipCard', () => {
  it('renders the event, selection, market, and odds', () => {
    const { container } = render(
      <BetSlipCard selection={selection} onRemove={vi.fn()} />,
    );

    expect(container).toHaveTextContent('Arsenal vs Manchester City');
    expect(container).toHaveTextContent('Arsenal');
    expect(container).toHaveTextContent('Match Winner');
    expect(container).toHaveTextContent('1.65');
  });

  it('calls onRemove exactly once when the remove button is clicked', async () => {
    const onRemove = vi.fn();
    render(<BetSlipCard selection={selection} onRemove={onRemove} />);

    await userEvent.click(
      screen.getByRole('button', { name: /remove arsenal from bet slip/i }),
    );

    expect(onRemove).toHaveBeenCalledTimes(1);
  });

  it('does not call onRemove on render', () => {
    const onRemove = vi.fn();
    render(<BetSlipCard selection={selection} onRemove={onRemove} />);

    expect(onRemove).not.toHaveBeenCalled();
  });
});
