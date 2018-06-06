import { Application, NextFunction, Request, Response } from "express";
import * as HttpStatus from "http-status-codes";
import GenericResponse from "../model/genericResponse";
import GenericController from "./genericController";

export default class JwtValidationFilter extends GenericController {
    constructor(contextPath: string) {
        super(contextPath);
    }

    public createRoutes(app: Application) {
        app.use(this.contextPath, (request: Request, response: Response, next: NextFunction) => {
            const authorizationHeader = request.header("Authorization");
            if (authorizationHeader !== undefined) {
                const authorizationHeaderPattern = /Bearer (.+\..+\.\S+)/g;
                const tokenMatch = authorizationHeaderPattern.exec(authorizationHeader);
                if (tokenMatch.length === 2) {
                    // verify(tokenMatch[1], fs.readFileSync('configuration/public.pem'),
                    // { algorithms: ['RS256'], audience: 'intranet-sp-framework' }, function (err, decoded) {
                    //     if (err) {
                    //         return res.json({ message: 'Failed to authenticate token.', details: err });
                    //     } else {
                    //         res.locals.jwtPayload = decoded;
                    //         next();
                    //     }
                    // });
                    next();
                    return;
                }
            }
            next(new Error(`JwtValidation-${request.params.id}`));
        });
    }
}

Object.seal(JwtValidationFilter);
