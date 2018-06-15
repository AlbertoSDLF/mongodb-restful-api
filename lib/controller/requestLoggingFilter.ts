import { Next, Request, Response } from "restify";
import { Server } from "restify";
import * as uuid from "uuid";
import * as logger from "winston";
import GenericController from "./genericController";

export default class RequestLoggingFilter extends GenericController {
    constructor() {
        super();
    }

    public createRoutes(server: Server) {
        server.pre((request: Request, response: Response, next: Next) => {
            const requestId = uuid.v1();
            const ip = request.header("X-Forwarded-For") || request.connection.remoteAddress;
            /* tslint:disable:max-line-length */
            logger.info(`${requestId} => ${request.method} ${request.getPath()} from ${ip} using ${request.header("User-Agent")}`);
            next();
        });
    }
}

Object.seal(RequestLoggingFilter);
