import * as HttpStatus from "http-status-codes";
import { Next, Request, Response, Server } from "restify";
import CustomResponse from "../model/customResponse";
import EntityNotFoundError from "./error/entityNotFoundError";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    public createRoutes(server: Server) {
        server.on("MethodNotAllowed", this.defaultMessageHandler);
        server.on("NotAcceptable", this.defaultMessageHandler);
        server.on("Unauthorized", this.customMessageHandler);
        server.on("InvalidCredentials", this.customMessageHandler);
        server.on("Internal", this.customMessageHandler);
        server.on("NotFound", (request: Request, response: Response, error, cb): void => {
            response.statusCode = HttpStatus.NOT_FOUND;
            if (error instanceof EntityNotFoundError) {
                response.send(new CustomResponse(HttpStatus.NOT_FOUND, error.message, request));
            } else {
                response.send(CustomResponse.getDefault(HttpStatus.NOT_FOUND, request));
            }
        });
    }

    private defaultMessageHandler = (request: Request, response: Response, error, cb): void => {
        response.statusCode = error.statusCode;
        response.send(CustomResponse.getDefault(error.statusCode, request));
    }

    private customMessageHandler = (request: Request, response: Response, error, cb): void => {
        response.statusCode = error.statusCode;
        response.send(new CustomResponse(error.statusCode, error.message, request));
    }
}

Object.seal(ErrorController);
