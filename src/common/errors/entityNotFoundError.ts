import { CustomError } from './customError';

/**
 * Error thrown when a requested entity cannot be found in the database.
 *
 * Results in a **404 Not Found** response.
 */
export class EntityNotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string) {
    super('Entity not found');
    Object.setPrototypeOf(this, EntityNotFoundError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
