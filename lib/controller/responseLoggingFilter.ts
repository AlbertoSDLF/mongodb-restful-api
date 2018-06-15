import { Next, Request, Response, Server } from "restify";
import * as logger from "winston";
import GenericController from "./genericController";

export default class ResponseLoggingFilter extends GenericController {
    public createRoutes(server: Server) {
        server.use((request: Request, response: Response, next: Next) => {
            logger.info(`${request.id()} => OK ${response.statusCode}`);
            next();
        });
    }
}

Object.seal(ResponseLoggingFilter);
