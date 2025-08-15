import { CustomError, ErrorsArr } from './customError';

export class MethodArgumentNotValidError extends CustomError {
  statusCode = 400;

  constructor(public message: string, public errorsArr: ErrorsArr) {
    super(message);
    Object.setPrototypeOf(this, MethodArgumentNotValidError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message,
      fields: this.errorsArr.length > 0 ? this.errorsArr : undefined,
    };
  }
}
