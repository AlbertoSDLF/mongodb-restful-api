import { HttpStatus as NestHttpStatus } from '@nestjs/common';
import * as i18n from 'i18n';
import changeCaseObject = require('change-case-object');
import HttpStatus = require('http-status-codes');

export default class DefaultResponse {
    private httpStatus: Number;
    private httpMessage: String;
    private moreInformation: String;
    private path: String;
    private timestamp: String;

    constructor(httpStatus: NestHttpStatus, moreInformation: String, path: String) {
        this.httpStatus = httpStatus;
        this.httpMessage = HttpStatus.getStatusText(httpStatus);
        if (moreInformation !== null) {
            this.moreInformation = moreInformation;
        }
        this.path = path;
        this.timestamp = new Date().toISOString();
    }

    public toJSON() {
        return changeCaseObject.snakeCase(this);
    }

    public static generate(httpStatus: NestHttpStatus, path: String): DefaultResponse {
        return new DefaultResponse(httpStatus, i18n.__(httpStatus + '.default'), path);
    }
}

Object.seal(DefaultResponse);