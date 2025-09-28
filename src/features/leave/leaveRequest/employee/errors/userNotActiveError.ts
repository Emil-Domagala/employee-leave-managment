import { CustomError } from '../../../../../common/errors/customError';

/**
 * Error thrown when a user tries to create a leave request but their account is inactive.
 * Results in **400 Bad Request**.
 */
export class UserNotActiveError extends CustomError {
  statusCode = 400;
  message = 'User is not active';

  constructor(message?: string) {
    super(message ?? 'User is not active');
    Object.setPrototypeOf(this, UserNotActiveError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: this.message };
  }
}
