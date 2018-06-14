import { Request, Response } from "express";
import { Server } from "restify";
import * as logger from "winston";
import GenericResponse from "../model/genericResponse";
import GenericController from "./genericController";
import * as HttpStatus from "http-status-codes";

export default class ErrorController extends GenericController {
    constructor() {
        super();
    }

    public createRoutes(server: Server) {
        server.on("Unauthorized", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.requestId} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return GenericResponse.getDefault(401, request);
            };
            cb();
        });
        server.on("InvalidCredentials", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.requestId} => NOT_OK ${HttpStatus.UNAUTHORIZED} ${error.message}`);
            error.toJSON = function toJSON() {
                return GenericResponse.getDefault(401, request);
            };
            cb();
        });
    }
}

Object.seal(ErrorController);
