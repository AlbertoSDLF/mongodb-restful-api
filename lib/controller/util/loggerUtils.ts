import { Request, Response } from "restify";
import * as logger from "winston";

export default class LoggerUtils {
    public static writeLog(request: Request, errorMessage: string, statusCode: number): void {
        const customMessage = {
            "auth": request.header("Authorization"),
            "details": "",
            "ip": request.connection.remoteAddress,
            "method": request.method,
            "path": request.path(),
            "protocol": request.httpVersion,
            "status-code": statusCode,
            "timestamp": new Date(request.time()).toISOString(),
            "user-agent": request.userAgent(),
        };
        if (errorMessage !== null) {
            customMessage.details = errorMessage;
        }
        const succesStatusCodePattern = /2\d\d/g;
        const match: RegExpExecArray = succesStatusCodePattern.exec(`${statusCode}`);
        if (match) {
            logger.info("Success", customMessage);
        } else {
            logger.error("Error", customMessage);
        }
    }
}
