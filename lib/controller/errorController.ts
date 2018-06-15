import * as HttpStatus from "http-status-codes";
import { Request, Response, Server } from "restify";
import * as logger from "winston";
import CustomResponse from "../model/customResponse";
import EntityNotFoundError from "./error/entityNotFoundError";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    public createRoutes(server: Server) {
        server.on("NotAcceptable", this.defaultHandler(HttpStatus.NOT_ACCEPTABLE));
        server.on("Unauthorized", this.defaultHandler(HttpStatus.UNAUTHORIZED));
        server.on("InvalidCredentials", this.defaultHandler(HttpStatus.UNAUTHORIZED));
        
        server.on("NotFound", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.id()} => NOT_OK ${HttpStatus.NOT_FOUND} ${error.message}`);
            error.toJSON = function toJSON() {
                if (error instanceof EntityNotFoundError) {
                    return new CustomResponse(HttpStatus.NOT_FOUND, error.message, request);
                } else {
                    return CustomResponse.getDefault(HttpStatus.NOT_FOUND, request);
                }
            };
            cb();
        });
    }

    private defaultHandler = (httpStatus) => {
        return (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.id()} => NOT_OK ${httpStatus} ${error.message}`);
            error.toJSON = function toJSON() {
                return new CustomResponse(httpStatus, error.message, request);
            };
            cb();
        };
    }
}

Object.seal(ErrorController);
