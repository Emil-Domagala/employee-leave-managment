import { CustomError } from '../../../../../common/errors/customError';

/**
 * Error thrown when trying to create an Leave Type with this name already exists.
 *
 * Results in a **400 Bad Request** response.
 */
export class LeaveTypeAlreadyExistsError extends CustomError {
  statusCode = 400;

  constructor(
    public message: string = 'Leave Type with this name already exists',
  ) {
    super('Employee email exists');
    Object.setPrototypeOf(this, LeaveTypeAlreadyExistsError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
