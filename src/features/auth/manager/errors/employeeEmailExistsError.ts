import { CustomError } from '../../../../common/errors/customError';


/**
 * Error thrown when trying to create an employee with an email that already exists.
 *
 * Results in a **400 Bad Request** response.
 */
export class EmployeeEmailExistsError extends CustomError {
  statusCode = 400;

  constructor(public message: string = 'Employee with this email already exists') {
    super('Employee email exists');
    Object.setPrototypeOf(this, EmployeeEmailExistsError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}