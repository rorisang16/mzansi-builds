class CustomError extends Error{ //inherits built in error class

    constructor(message, statusCode){

//calling constructor
super(message);
this.statusCode = statusCode;
//if status code is between 400 and 499, set status to fail, otherwise set it to error
this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';

this.isOperational = true; // marks this error as operational, meaning it is a known error that can be handled gracefully

Error.captureStackTrace(this, this.constructor); // captures the stack trace for debugging purposes, excluding the constructor call from the trace



    }

}

//more specific error types that extend customerror class for better error handling and categorisation

export class DatabaseError extends CustomError {
  constructor(message) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

export class ValidationError extends CustomError {
  constructor(message) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends CustomError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

export class BadRequestError extends CustomError {
  constructor(message) {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message) {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}

export class ConflictError extends CustomError {
  constructor(message) {
    super(message, 409); // Duplicate entry, etc
    this.name = 'ConflictError';
  }
}

export default CustomError; // exports the custom error class for use in other parts of the application