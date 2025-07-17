import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DomainException } from '@shared/domain/exception/DomainException';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse();

      return response.status(status).json({
        ...((typeof responseBody === 'string')
          ? { message: responseBody }
          : responseBody),
        statusCode: status,
        timestamp,
        path: request.url,
      });
    }

    if (exception instanceof DomainException) {
      return response.status(exception.getStatus()).json({
        ...(exception.getDetails() || {}),
        statusCode: exception.getStatus(),
        timestamp,
        path: request.url,
      });
    }

    if (
      exception instanceof QueryFailedError &&
      exception.driverError.code === '23505'
    ) {
      return response.status(HttpStatus.CONFLICT).json({
        message: 'Duplicate key error',
        constraint: exception.driverError.constraint,
        statusCode: HttpStatus.CONFLICT,
        timestamp,
        path: request.url,
      });
    }

    console.error('Unhandled exception:', exception);

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      message: 'Internal server error',
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp,
      path: request.url,
    });
  }
}
