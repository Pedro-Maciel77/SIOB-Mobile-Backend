import { Response } from 'express';
import { HTTP_STATUS } from '../constants/status.codes';
import { MESSAGES } from '../constants/messages.constants';

export class ResponseHelper {
  static success(
    res: Response,
    data: any = null,
    message: string = MESSAGES.SUCCESS,
    statusCode: number = HTTP_STATUS.OK
  ) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      timestamp: new Date().toISOString()
    });
  }

  static created(res: Response, data: any, message: string = MESSAGES.CREATED) {
    return this.success(res, data, message, HTTP_STATUS.CREATED);
  }

  static error(
    res: Response,
    message: string = MESSAGES.INTERNAL_ERROR,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    errors: any[] = []
  ) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString()
    });
  }

  static validationError(res: Response, errors: any[]) {
    return this.error(
      res,
      MESSAGES.VALIDATION_ERROR,
      HTTP_STATUS.UNPROCESSABLE_ENTITY,
      errors
    );
  }

  static notFound(res: Response, message: string = MESSAGES.NOT_FOUND) {
    return this.error(res, message, HTTP_STATUS.NOT_FOUND);
  }

  static unauthorized(res: Response, message: string = MESSAGES.UNAUTHORIZED) {
    return this.error(res, message, HTTP_STATUS.UNAUTHORIZED);
  }

  static forbidden(res: Response, message: string = MESSAGES.FORBIDDEN) {
    return this.error(res, message, HTTP_STATUS.FORBIDDEN);
  }

  static paginated(
    res: Response,
    data: any[],
    total: number,
    page: number,
    limit: number,
    message: string = MESSAGES.SUCCESS
  ) {
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
        nextPage: hasNext ? page + 1 : null,
        prevPage: hasPrev ? page - 1 : null
      },
      timestamp: new Date().toISOString()
    });
  }
}