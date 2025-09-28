import { CustomError } from './customError';

/**
 * Error thrown when an entity could not be saved to the database.
 *
 * Use for insert/update failures like duplicate keys or FK violations.
 */
export class CouldNotSaveEntityError extends CustomError {
  statusCode = 400;

  constructor(public entityName: string, public message: string) {
    super(`Could not save entity: ${entityName}`);
    Object.setPrototypeOf(this, CouldNotSaveEntityError.prototype);
  }

  serializeErrors() {
    return {
      status: this.statusCode,
      entity: this.entityName,
      message: this.message,
    };
  }
}
