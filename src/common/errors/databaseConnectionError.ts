import { CustomError } from './customError';

export class DatabaseConnectionError extends CustomError {
  reason = 'Database connection error';
  statusCode = 500;
  constructor() {
    super('Error connecting to the database');
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return { status: this.statusCode, message: this.reason };
  }
}
