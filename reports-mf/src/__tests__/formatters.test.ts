import { formatDate, formatNumber, getStatusLabel } from '../utils/formatters';

describe('formatDate', () => {
  it('formats ISO date string correctly', () => {
    const result = formatDate('2024-01-15T10:30:00.000Z');
    expect(result).toContain('Jan');
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });
});

describe('formatNumber', () => {
  it('returns plain number for values under 1000', () => {
    expect(formatNumber(500)).toBe('500');
  });

  it('formats thousands with k suffix', () => {
    expect(formatNumber(1500)).toBe('1.5k');
  });

  it('handles exact thousands', () => {
    expect(formatNumber(1000)).toBe('1.0k');
  });

  it('handles zero', () => {
    expect(formatNumber(0)).toBe('0');
  });
});

describe('getStatusLabel', () => {
  it('returns "Completed" for completed status', () => {
    expect(getStatusLabel('completed')).toBe('Completed');
  });

  it('returns "In Progress" for in_progress status', () => {
    expect(getStatusLabel('in_progress')).toBe('In Progress');
  });

  it('returns "Failed" for failed status', () => {
    expect(getStatusLabel('failed')).toBe('Failed');
  });

  it('returns raw status for unknown values', () => {
    expect(getStatusLabel('unknown')).toBe('unknown');
  });
});
