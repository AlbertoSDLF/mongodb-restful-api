import * as HttpStatus from "http-status-codes";
import * as i18n from "i18n";
import { InternalError } from "restify-errors";

export default class MongodbError extends InternalError {
    constructor(type: string) {
        super();
        if (type === "CastError") {
            this.statusCode = HttpStatus.BAD_REQUEST;
            this.message = i18n.__("400.invalidId");
        } else {
            this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            this.message = i18n.__("500.default");
        }
    }
}
