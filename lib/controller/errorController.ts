import { Application, NextFunction, Request, Response } from "express";
import * as HttpStatus from "http-status-codes";
import * as i18n from "i18n";
import GenericResponse from "../model/genericResponse";
import GenericController from "./genericController";

export default class ErrorController extends GenericController {
    constructor() {
        super("/");
    }

    public createRoutes(app: Application) {
        app.use(this.contextPath, (error: Error, request: Request, response: Response, next: NextFunction) => {
            // Used by responseLoggingFilter
            let errorDescription: string;
            if (error.message.startsWith("JwtValidation")) {
                response.status(HttpStatus.UNAUTHORIZED).json(GenericResponse.getDefault(401, request));
                errorDescription = GenericResponse.getDefault(401, request).getMoreInformation();
            } else if (error.message.startsWith("EntityNotFound")) {
                const errorMessageFields = error.message.split("-");
                errorDescription = i18n.__("404.entityNotFound", errorMessageFields[1], errorMessageFields[2]);
                response.status(HttpStatus.NOT_FOUND).json(new GenericResponse(HttpStatus.NOT_FOUND,
                    errorDescription, request));
            } else if (error.name === "MongoError" || error.name === "ValidationError" || error.name === "CastError") {
                response.status(HttpStatus.BAD_REQUEST).json(
                    new GenericResponse(HttpStatus.BAD_REQUEST, error.message, request));
                errorDescription = error.message;
            } else if (new Object(error).hasOwnProperty("statusCode")) {
                /* tslint:disable:no-string-literal */
                const statusCode: number = new Object(error)["statusCode"];
                response.status(statusCode).json(GenericResponse.getDefault(statusCode, request));
                errorDescription = GenericResponse.getDefault(statusCode, request).getMoreInformation();
            } else {
                response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(
                    GenericResponse.getDefault(HttpStatus.INTERNAL_SERVER_ERROR, request));
                errorDescription = GenericResponse.getDefault(
                    HttpStatus.INTERNAL_SERVER_ERROR, request).getMoreInformation();
            }
            response.locals.errorDescription = errorDescription;
            next();
        });
    }
}

Object.seal(ErrorController);
