import { Request, Response } from "express";
import { Server } from "restify";
import * as logger from "winston";
import GenericResponse from "../model/genericResponse";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    private readonly errorHandlers = {
        "InvalidCredentials": ""
    };
    constructor() {
        super();
    }

    public createRoutes(server: Server) {
        server.on("InvalidCredentials", (request: Request, response: Response, error, cb): void => {
            logger.warn(`${request.requestId} => NOT_OK 401 ${error.message}`);
            error.toJSON = function toJSON() {
                return GenericResponse.getDefault(401, request);
            };
            cb();
        });
    }
}

Object.seal(ErrorController);
