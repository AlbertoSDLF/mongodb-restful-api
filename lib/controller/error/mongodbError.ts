import * as HttpStatus from "http-status-codes";
import * as i18n from "i18n";
import { InternalError } from "restify-errors";

export default class MongodbError extends InternalError {
    constructor(entityName: string, type: string, details: string) {
        super();
        if (type === "CastError") {
            this.statusCode = HttpStatus.BAD_REQUEST;
            this.message = i18n.__("400.invalidId");
        } else if (type === "MongoError" && details.startsWith("E11000")) {
            const errorMessagePattern = /.+ObjectId\('(.+)'/g;
            const match = errorMessagePattern.exec(details);
            this.statusCode = HttpStatus.CONFLICT;
            this.message = i18n.__("409.duplicateId", entityName, match[1]);
        } else if (type === "ValidationError") {
            this.statusCode = HttpStatus.BAD_REQUEST;
            this.message = details;
        } else {
            this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
            this.message = i18n.__("500.default");
        }
    }
}
