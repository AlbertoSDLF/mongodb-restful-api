import * as i18n from "i18n";
import { InvalidCredentialsError } from "restify-errors";

export default class JwtValidationError extends InvalidCredentialsError {
    constructor(type: string, details: string) {
        super();
        if (type === "TokenExpiredError") {
            this.message = i18n.__("401.expiredToken");
        } else if (type === "JsonWebTokenError" && details.startsWith("jwt audience invalid")) {
            this.message = i18n.__("401.invalidAudience");
        } else {
            this.message = i18n.__("401.invalidToken");
        }
    }
}
