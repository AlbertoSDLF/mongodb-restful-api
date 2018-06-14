import * as HttpStatus from "http-status-codes";
import { Request, Response, Server } from "restify";
import GenericResponse from "../model/genericResponse";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    public createRoutes(server: Server) {
        server.on("NotAcceptable", (request: Request, response: Response, error, cb): void => {
//            logger.warn(`${request.requestId} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return GenericResponse.getDefault(HttpStatus.NOT_ACCEPTABLE, request);
            };
            cb();
        });
        server.on("Unauthorized", (request: Request, response: Response, error, cb): void => {
//            logger.warn(`${request.requestId} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return GenericResponse.getDefault(HttpStatus.UNAUTHORIZED, request);
            };
            cb();
        });
        server.on("InvalidCredentials", (request: Request, response: Response, error, cb): void => {
//            logger.warn(`${request.requestId} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return GenericResponse.getDefault(HttpStatus.UNAUTHORIZED, request);
            };
            cb();
        });
    }
}

Object.seal(ErrorController);
