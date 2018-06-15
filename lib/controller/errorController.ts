import * as HttpStatus from "http-status-codes";
import { Request, Response, Server } from "restify";
import * as logger from "winston";
import CustomResponse from "../model/customResponse";
import EntityNotFoundError from "./error/entityNotFoundError";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    public createRoutes(server: Server) {
        server.on("NotAcceptable", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.id()} => NOT_OK ${HttpStatus.NOT_ACCEPTABLE} ${error.message}`);
            error.toJSON = function toJSON() {
                return new CustomResponse(HttpStatus.NOT_ACCEPTABLE, error.message, request);
            };
            cb();
        });
        server.on("Unauthorized", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.id()} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return CustomResponse.getDefault(HttpStatus.UNAUTHORIZED, request);
            };
            cb();
        });
        server.on("InvalidCredentials", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.id()} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return new CustomResponse(HttpStatus.UNAUTHORIZED, error.message, request);
            };
            cb();
        });
        server.on("NotFound", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.id()} => NOT_OK ${HttpStatus.NOT_FOUND} ${error.message}`);
            error.toJSON = function toJSON() {
                if (error instanceof EntityNotFoundError) {
                    return new CustomResponse(HttpStatus.NOT_FOUND, error.message, request);
                } else {
                    return CustomResponse.getDefault(HttpStatus.NOT_FOUND, request);
                };
            }
            cb();
        });
    }
}

Object.seal(ErrorController);
