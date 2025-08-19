import { CustomError } from './customError';

/**
 * Error thrown when route do not exists
 *
 * Results in a **404 Not Found** response.
 */
export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Route not found');
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: 'Route not found',
    };
  }
}
