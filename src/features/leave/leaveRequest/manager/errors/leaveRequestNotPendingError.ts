import { CustomError } from '../../../../../common/errors/customError';

/**
 * Error thrown when trying to update a leave request that is not pending.
 *
 * Results in a **400 Bad Request** response.
 */
export class LeaveRequestNotPendingError extends CustomError {
  statusCode = 400;

  constructor(
    public message: string = 'Only pending leave requests can be updated',
  ) {
    super(message);
    Object.setPrototypeOf(this, LeaveRequestNotPendingError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}
