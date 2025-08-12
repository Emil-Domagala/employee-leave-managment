import { CustomError } from './customError';

export class JwtError extends CustomError {
  public message: string;
  statusCode = 500;
  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, JwtError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
