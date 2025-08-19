import { CustomError } from '../../errors/customError';

// Auth token missing
export class SessionInvalidError extends CustomError {
  statusCode = 401;
  constructor() {
    super('Auth token invalid');
    Object.setPrototypeOf(this, SessionInvalidError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: 'Auth token invalid' };
  }
}
