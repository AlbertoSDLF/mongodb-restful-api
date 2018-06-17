import * as HttpStatus from "http-status-codes";
import { Next, Request, Response, Server } from "restify";
import * as logger from "winston";
import CustomResponse from "../model/customResponse";
import EntityNotFoundError from "./error/entityNotFoundError";
import GenericController from "./genericController";
import LoggerUtils from "./util/loggerUtils";

export default class ErrorController extends GenericController {
    public createRoutes(server: Server) {
        // Log success responses
        server.use((request: Request, response: Response, next: Next) => {
            LoggerUtils.writeLog(request, response, null);
            next();
        });

        // Create and log error responses
        server.on("NotAcceptable", this.defaultMessageHandler);
        server.on("Unauthorized", this.customMessageHandler);
        server.on("InvalidCredentials", this.customMessageHandler);
        server.on("MethodNotAllowed", this.defaultMessageHandler);
        server.on("Internal", this.customMessageHandler);

        server.on("NotFound", (request: Request, response: Response, error, cb): void => {
            LoggerUtils.writeLog(request, response, error.message);
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
        const customError: CustomResponse = CustomResponse.getDefault(error.statusCode, request);
        error.toJSON = function toJSON() {
            return customError;
        };
        LoggerUtils.writeLog(request, response, customError.getMoreInformation());
        cb();
    }

    private customMessageHandler = (request: Request, response: Response, error, cb): void => {
        error.toJSON = function toJSON() {
            return new CustomResponse(error.statusCode, error.message, request);
        };
        LoggerUtils.writeLog(request, response, error.message);
        cb();
    }
}

Object.seal(ErrorController);
