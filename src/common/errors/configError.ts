import { CustomError } from './customError';

export class ConfigError extends CustomError {
  public message: string;
  statusCode = 500;
  constructor(message: string) {
    super(message);
    this.message = message;
    Object.setPrototypeOf(this, ConfigError.prototype);
  }

  serializeErrors() {
    return [{ message: this.message }];
  }
}
