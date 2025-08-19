import type { Request, Response, NextFunction } from 'express';
import { CustomError } from './common/errors/customError';
import { InternalServerError } from './common/errors/internalServerError';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({ errors: err.serializeErrors() });
    return;
  }

  console.error(err);
  const defaultError = new InternalServerError();
  res
    .status(defaultError.statusCode)
    .send({ errors: defaultError.serializeErrors() });
};
