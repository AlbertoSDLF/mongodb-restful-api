import { Next, Request, Response, Server } from "restify";
import * as logger from "winston";
import GenericController from "./genericController";
import LoggerUtils from "./util/loggerUtils";

export default class ResponseLoggingFilter extends GenericController {
    public createRoutes(server: Server) {
        server.use((request: Request, response: Response, next: Next) => {
            LoggerUtils.writeLog(request, response, null);
            next();
        });
    }
}

Object.seal(ResponseLoggingFilter);
