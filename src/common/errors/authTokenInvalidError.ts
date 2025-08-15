import { CustomError } from './customError';

// Auth token missing
export class AuthTokenInvalidError extends CustomError {
  statusCode = 498;
  constructor() {
    super('Auth token invalid');
    Object.setPrototypeOf(this, AuthTokenInvalidError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: 'Auth token invalid' };
  }
}
