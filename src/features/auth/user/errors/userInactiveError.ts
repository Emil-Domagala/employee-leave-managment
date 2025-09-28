import { CustomError } from '../../../../common/errors/customError';

export class UserInactiveError extends CustomError {
  statusCode = 400;

  constructor() {
    super('Login failed');
    Object.setPrototypeOf(this, UserInactiveError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: 'Login failed, user inactive',
    };
  }
}
