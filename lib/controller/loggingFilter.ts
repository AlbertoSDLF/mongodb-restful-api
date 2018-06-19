import { Request, Response, Server } from "restify";
import * as logger from "winston";
import GenericController from "./genericController";

export default class LoggingFilter extends GenericController {
    public createRoutes(server: Server) {
        server.on("after", (request: Request, response: Response, route, error): void => {
            const customMessage = {
                "api-version": response.getHeader("api-version"),
                "auth": request.header("Authorization"),
                "details": "",
                "ip": request.connection.remoteAddress,
                "method": request.method,
                "path": request.path(),
                "protocol": request.httpVersion,
                "status-code": error ? error.statusCode : response.statusCode,
                "timestamp": new Date(request.time()).toISOString(),
                "user-agent": request.userAgent(),
            };
            if (error) {
                customMessage.details = error.message;
            }
            const succesStatusCodePattern = /2\d\d/g;
            const match: RegExpExecArray = succesStatusCodePattern.exec(`${response.statusCode}`);
            logger.info(match ? "Success" : "Error", customMessage);
        });
    }
}

Object.seal(LoggingFilter);
