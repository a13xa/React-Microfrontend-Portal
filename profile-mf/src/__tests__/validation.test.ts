import { validateProfileForm } from '../utils/validation';

describe('validateProfileForm', () => {
  it('returns valid for complete data', () => {
    const result = validateProfileForm({
      name: 'John Doe',
      phone: '555-1234',
      department: 'Engineering',
    });
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('returns error for empty name', () => {
    const result = validateProfileForm({
      name: '',
      phone: '555-1234',
      department: 'Engineering',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Name is required');
  });

  it('returns error for short name', () => {
    const result = validateProfileForm({
      name: 'J',
      phone: '555-1234',
      department: 'Engineering',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Name must be at least 2 characters');
  });

  it('returns error for empty phone', () => {
    const result = validateProfileForm({
      name: 'John',
      phone: '',
      department: 'Engineering',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.phone).toBe('Phone is required');
  });

  it('returns error for empty department', () => {
    const result = validateProfileForm({
      name: 'John',
      phone: '555-1234',
      department: '',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.department).toBe('Department is required');
  });

  it('returns multiple errors for multiple invalid fields', () => {
    const result = validateProfileForm({
      name: '',
      phone: '',
      department: '',
    });
    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors)).toHaveLength(3);
  });
});
