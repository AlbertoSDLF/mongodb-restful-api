import { Application, NextFunction, Request, Response } from "express";
import * as uuid from "uuid";
import * as logger from "winston";
import GenericController from "./genericController";

export default class RequestLoggingFilter extends GenericController {
    constructor(contextPath: string) {
        super(contextPath);
    }

    public createRoutes(app: Application) {
        app.use(this.contextPath, (request: Request, response: Response, next: NextFunction) => {
            const requestId = uuid.v1();
            const ip = request.header("X-Forwarded-For") || request.connection.remoteAddress;
            /* tslint:disable:max-line-length */
            logger.info(`${requestId} => ${request.method} ${request.path} from ${ip} using ${request.header("User-Agent")}`);
            response.locals.requestId = requestId;
            next();
        });
    }
}

Object.seal(RequestLoggingFilter);
