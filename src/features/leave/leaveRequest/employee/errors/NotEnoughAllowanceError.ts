import { CustomError } from '../../../../../common/errors/customError';

/**
 * Error thrown when requested days exceed available allowance.
 * Results in **400 Bad Request**.
 */
export class NotEnoughAllowanceError extends CustomError {
  statusCode = 400;
  message = 'You do not have enough allowance for this leave type';

  constructor(message?: string) {
    super(message ?? 'You do not have enough allowance for this leave type');
    Object.setPrototypeOf(this, NotEnoughAllowanceError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: this.message };
  }
}
