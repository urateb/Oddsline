import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { OddsButton } from './odds-button';

describe('OddsButton', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders the label and formatted odds', () => {
    render(<OddsButton label="1" odds={1.5} />);

    expect(
      screen.getByRole('button', { name: '1, odds 1.50' }),
    ).toBeInTheDocument();
    expect(screen.getByText('1.50')).toBeInTheDocument();
  });

  it('flashes green ("shorten") when odds decrease', () => {
    const { rerender } = render(<OddsButton label="1" odds={1.5} />);

    rerender(<OddsButton label="1" odds={1.3} />);

    expect(screen.getByRole('button')).toHaveAttribute('data-flash', 'shorten');
  });

  it('flashes red ("drift") when odds increase', () => {
    const { rerender } = render(<OddsButton label="1" odds={1.5} />);

    rerender(<OddsButton label="1" odds={1.8} />);

    expect(screen.getByRole('button')).toHaveAttribute('data-flash', 'drift');
  });

  it('does not flash when odds are unchanged', () => {
    const { rerender } = render(<OddsButton label="1" odds={1.5} />);

    rerender(<OddsButton label="1" odds={1.5} />);

    expect(screen.getByRole('button')).not.toHaveAttribute('data-flash');
  });

  it('clears the flash automatically after the animation window', () => {
    vi.useFakeTimers();
    const { rerender } = render(<OddsButton label="1" odds={1.5} />);

    rerender(<OddsButton label="1" odds={1.3} />);
    expect(screen.getByRole('button')).toHaveAttribute('data-flash', 'shorten');

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(screen.getByRole('button')).not.toHaveAttribute('data-flash');
  });

  it('reflects the selected state via aria-pressed', () => {
    render(<OddsButton label="1" odds={1.5} isSelected />);

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
  });

  it('does not flash while selected, even when odds change', () => {
    const { rerender } = render(<OddsButton label="1" odds={1.5} isSelected />);

    rerender(<OddsButton label="1" odds={1.3} isSelected />);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-flash');

    rerender(<OddsButton label="1" odds={1.8} isSelected />);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-flash');
  });

  it('stops an in-progress flash as soon as the button becomes selected', () => {
    const { rerender } = render(<OddsButton label="1" odds={1.5} />);

    rerender(<OddsButton label="1" odds={1.3} />);
    expect(screen.getByRole('button')).toHaveAttribute('data-flash', 'shorten');

    rerender(<OddsButton label="1" odds={1.3} isSelected />);
    expect(screen.getByRole('button')).not.toHaveAttribute('data-flash');
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    render(<OddsButton label="1" odds={1.5} onToggle={onToggle} />);

    await userEvent.click(screen.getByRole('button'));

    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('is disabled, hides the odds, and ignores clicks while suspended', async () => {
    const onToggle = vi.fn();
    render(<OddsButton label="1" odds={1.5} suspended onToggle={onToggle} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(screen.queryByText('1.50')).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(onToggle).not.toHaveBeenCalled();
  });
});
