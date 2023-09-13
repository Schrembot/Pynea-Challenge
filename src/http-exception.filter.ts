import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { upperCaseFirst } from 'text-case';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    let processed_exception = JSON.parse(
      JSON.stringify(exception.getResponse()),
    );

    // Format the message in a more appropriate way.
    // Validation will return an array of messages, so we need to capitalize each one.
    let message;
    if (
      processed_exception.message &&
      processed_exception.message instanceof Array
    ) {
      let a = [];
      for (let i = 0; i < processed_exception.message.length; i++) {
        a.push(upperCaseFirst(processed_exception.message[i]));
      }
      message = a.join('\n');
    } else {
      message = upperCaseFirst(processed_exception.message);
    }

    // Intercept HTTP Errors but don't intercept GraphQL Errors as the contexts are not the same
    if (host.getType() === 'http') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      // Send it - this response is the reason we can't use the same logic on GraphQL
      response.status(status).json({
        data: null,
        error: message,
      });
    } else {
      exception.message = message;
      throw exception;
    }
  }
}
