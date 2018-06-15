import * as HttpStatus from "http-status-codes";
import { Request, Response, Server } from "restify";
import * as logger from "winston";
import CustomResponse from "../model/customResponse";
import EntityNotFoundError from "./error/entityNotFoundError";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    public createRoutes(server: Server) {
        server.on("NotAcceptable", this.defaultMessageHandler);
        server.on("Unauthorized", this.customMessageHandler);
        server.on("InvalidCredentials", this.customMessageHandler);
        server.on("MethodNotAllowed", this.defaultMessageHandler);
        server.on("Internal", this.customMessageHandler);

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

    private defaultMessageHandler = (request: Request, response: Response, error, cb): void => {
        logger.warn(`${request.id()} => NOT_OK ${error.statusCode} ${error.message}`);
        error.toJSON = function toJSON() {
            return CustomResponse.getDefault(error.statusCode, request);
        };
        cb();
    }

    private customMessageHandler = (request: Request, response: Response, error, cb): void => {
        logger.warn(`${request.id()} => NOT_OK ${error.statusCode} ${error.message}`);
        error.toJSON = function toJSON() {
            return new CustomResponse(error.statusCode, error.message, request);
        };
        cb();
    }
}

Object.seal(ErrorController);
