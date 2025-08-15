import { CustomError } from './customError';

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
