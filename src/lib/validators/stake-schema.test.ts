import { describe, expect, it } from 'vitest';

import { createStakeFormSchema } from './stake-schema';

const limits = { minStake: 0.5, maxStake: 10000 };
const schema = createStakeFormSchema(limits);

describe('stake schema', () => {
  it('accepts a valid stake and coerces it to a number', () => {
    const result = schema.safeParse({ stake: '25.50' });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stake).toBe(25.5);
    }
  });

  it('accepts the minimum stake boundary (inclusive)', () => {
    expect(schema.safeParse({ stake: '0.50' }).success).toBe(true);
  });

  it('accepts the maximum stake boundary (inclusive)', () => {
    expect(schema.safeParse({ stake: '10000' }).success).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    const result = schema.safeParse({ stake: '  15  ' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.stake).toBe(15);
    }
  });

  it('rejects an empty stake as required', () => {
    const result = schema.safeParse({ stake: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/required/i);
    }
  });

  it('rejects non-numeric input', () => {
    expect(schema.safeParse({ stake: 'abc' }).success).toBe(false);
  });

  it('rejects a stake below the minimum', () => {
    const result = schema.safeParse({ stake: '0.10' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/minimum/i);
    }
  });

  it('rejects a stake above the maximum', () => {
    const result = schema.safeParse({ stake: '10000.01' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/maximum/i);
    }
  });

  it('rejects negative amounts', () => {
    expect(schema.safeParse({ stake: '-5' }).success).toBe(false);
  });

  it('rejects more than two decimal places', () => {
    expect(schema.safeParse({ stake: '5.123' }).success).toBe(false);
  });

  it('rejects scientific notation and non-finite strings', () => {
    expect(schema.safeParse({ stake: '1e3' }).success).toBe(false);
    expect(schema.safeParse({ stake: 'Infinity' }).success).toBe(false);
    expect(schema.safeParse({ stake: 'NaN' }).success).toBe(false);
  });

  it('rejects thousands separators', () => {
    expect(schema.safeParse({ stake: '1,000' }).success).toBe(false);
  });
});
