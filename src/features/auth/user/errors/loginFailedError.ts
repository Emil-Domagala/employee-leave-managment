import { CustomError } from '../../../../common/errors/customError';

export class LoginFailedError extends CustomError {
  statusCode = 404;

  constructor() {
    super('Login failed');
    Object.setPrototypeOf(this, LoginFailedError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: 'Login failed',
    };
  }
}
