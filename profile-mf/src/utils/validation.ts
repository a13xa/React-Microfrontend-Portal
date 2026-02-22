export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateProfileForm(data: { name: string; phone: string; department: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone is required';
  }

  if (!data.department.trim()) {
    errors.department = 'Department is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
