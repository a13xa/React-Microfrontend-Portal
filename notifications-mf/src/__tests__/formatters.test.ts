import { formatTimestamp, truncateText } from '../utils/formatters';

describe('formatTimestamp', () => {
  it('returns "Just now" for timestamps less than a minute ago', () => {
    const now = new Date().toISOString();
    expect(formatTimestamp(now)).toBe('Just now');
  });

  it('returns minutes ago for recent timestamps', () => {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60000).toISOString();
    expect(formatTimestamp(fiveMinutesAgo)).toBe('5m ago');
  });

  it('returns hours ago for timestamps within a day', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 3600000).toISOString();
    expect(formatTimestamp(threeHoursAgo)).toBe('3h ago');
  });

  it('returns days ago for timestamps within a week', () => {
    const twoDaysAgo = new Date(Date.now() - 2 * 86400000).toISOString();
    expect(formatTimestamp(twoDaysAgo)).toBe('2d ago');
  });
});

describe('truncateText', () => {
  it('returns full text when under max length', () => {
    expect(truncateText('Hello', 10)).toBe('Hello');
  });

  it('truncates text with ellipsis when over max length', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello...');
  });

  it('returns full text when exactly at max length', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });
});
