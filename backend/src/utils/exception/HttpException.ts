export class HttpException extends Error {
  public status: number;
  public message: string;
  public errors?: any[];

  constructor(status: number, message: string, errors?: any[]) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
    
    // Mantém o stack trace correto
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string = 'Bad Request', errors?: any[]) {
    return new HttpException(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized') {
    return new HttpException(401, message);
  }

  static forbidden(message: string = 'Forbidden') {
    return new HttpException(403, message);
  }

  static notFound(message: string = 'Not Found') {
    return new HttpException(404, message);
  }

  static conflict(message: string = 'Conflict') {
    return new HttpException(409, message);
  }

  static unprocessableEntity(message: string = 'Unprocessable Entity', errors?: any[]) {
    return new HttpException(422, message, errors);
  }

  static internalServerError(message: string = 'Internal Server Error') {
    return new HttpException(500, message);
  }
}