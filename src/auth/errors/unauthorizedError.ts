import { CustomError } from '../../common/errors/customError';

// Refresh token missing or invalid
export class UnauthorizedError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Unauthorized');
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: 'Unauthorized' };
  }
}
