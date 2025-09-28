import { CustomError } from '../../../../../common/errors/customError';

/**
 * Error thrown when the user already has a leave request overlapping with requested dates.
 * Results in **400 Bad Request**.
 */
export class OverlappingLeaveRequestError extends CustomError {
  statusCode = 400;
  message = 'You have overlapping leave request';

  constructor(message?: string) {
    super(message ?? 'You have overlapping leave request');
    Object.setPrototypeOf(this, OverlappingLeaveRequestError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: this.message };
  }
}
