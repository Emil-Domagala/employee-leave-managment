import { ZodType } from 'zod';
import { ErrorsArr } from '../errors/customError';
import { MethodArgumentNotValidError } from '../errors/methodArgumentNotValidError';

/**
 * Validates body against provided schema
 * @throws {MethodArgumentNotValidError} if body is not correct
 */
export const validateBody = <T>(body: unknown, schema: ZodType<T>): T => {
  const res = schema.safeParse(body);

  if (!res.success) {
    const errors: ErrorsArr = res.error.issues.map((err) => ({
      message: err.message,
      field: err.path.join('.'),
    }));
    throw new MethodArgumentNotValidError('Invalid request body', errors);
  }

  return res.data;
};
