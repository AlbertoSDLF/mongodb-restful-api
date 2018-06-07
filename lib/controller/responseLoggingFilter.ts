import { Application, NextFunction, Request, Response } from "express";
import * as logger from "winston";
import GenericController from "./genericController";

export default class ResponseLoggingFilter extends GenericController {
    constructor(contextPath?: string) {
        super(contextPath);
    }

    public createRoutes(app: Application) {
        app.use(this.contextPath, (request: Request, response: Response, next: NextFunction) => {
            const successStatusCodePattern = /^2\d\d$/g;
            const statusCodeMatch = successStatusCodePattern.exec(response.statusCode.toString());
            if (statusCodeMatch) {
                logger.info(`${response.locals.requestId} => OK`);
            } else {
                /* tslint:disable:max-line-length */
                logger.warn(`${response.locals.requestId} => NOT_OK ${response.statusCode} ${response.locals.errorDescription}`);
            }
            next();
        });
    }
}

Object.seal(ResponseLoggingFilter);
