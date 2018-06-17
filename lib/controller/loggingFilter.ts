import * as HttpStatus from "http-status-codes";
import { Next, Request, Response, Server } from "restify";
import GenericController from "./genericController";
import LoggerUtils from "./util/loggerUtils";

export default class LoggingFilter extends GenericController {
    public createRoutes(server: Server) {
        server.on("after", (request: Request, response: Response, route, error): void => {
            LoggerUtils.writeLog(request, error ? error.message : "", error ? error.statusCode : response.statusCode);
        });

    }
}

Object.seal(LoggingFilter);
