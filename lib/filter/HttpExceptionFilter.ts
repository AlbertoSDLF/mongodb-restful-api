import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import DefaultResponse from '../model/response/DefaultResponse';

@Catch(HttpException)
export default class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse();
        const request = context.getRequest();
        response.status(exception.getStatus()).json(new DefaultResponse(exception.getStatus(), exception.getResponse().toString(), request.path));
    }
}

Object.seal(HttpExceptionFilter);