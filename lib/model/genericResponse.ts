import * as changeCaseObject from "change-case-object";
import { Request } from "express";
import * as HttpStatus from "http-status-codes";
import * as i18n from "i18n";

export default class GenericResponse {
    public static getDefault(httpStatus: number, request: Request): GenericResponse {
        return new GenericResponse(httpStatus, i18n.__(`${httpStatus}.default`), request);
    }

    private httpStatus: number;
    private httpMessage: string;
    private moreInformation: string;
    private path: string;
    private timestamp: string;

    constructor(httpStatus: number, moreInformation: string, request: Request) {
        this.httpStatus = httpStatus;
        this.httpMessage = HttpStatus.getStatusText(httpStatus);
        if (moreInformation !== null) {
            this.moreInformation = moreInformation;
        }
        this.path = `${request.method} ${request.path}`;
        this.timestamp = new Date().toISOString();
    }

    public toJSON() {
        return changeCaseObject.snakeCase(this);
    }

    public getMoreInformation() {
        return this.moreInformation;
    }
}
