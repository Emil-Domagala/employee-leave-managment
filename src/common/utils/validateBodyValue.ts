export type ErrorsArr = {
  message: string;
  field: string;
};

export const validateBodyValue = (
  value: any,
  type: 'object' | 'string' | 'number' | 'boolean' | 'array',
  errors: ErrorsArr[],
) => {
  if (!value || typeof value !== type)
    errors.push({ message: 'Validation failed for ', field: value });
};
