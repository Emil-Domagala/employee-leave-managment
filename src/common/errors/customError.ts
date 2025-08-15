import { ErrorsArr } from '../utils/validateBodyValue';

export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }

  /**
   * Returns a structured error object:
   * {
   *   status: number;
   *   message: string;
   *   fields?: ErrorsArr[];
   * }
   */
  abstract serializeErrors(): {
    status: number;
    message: string;
    fields?: ErrorsArr[];
  };
}
