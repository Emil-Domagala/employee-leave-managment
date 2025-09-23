import { CustomError } from './customError';

export class AccessDenied extends CustomError {
  statusCode = 401;

  constructor() {
    super('Access denied');
    Object.setPrototypeOf(this, AccessDenied.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: 'Access denied',
    };
  }
}
