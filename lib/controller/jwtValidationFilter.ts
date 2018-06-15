import { NextFunction, Request, Response } from "express";
import * as fs from "fs";
import * as i18n from "i18n";
import { verify } from "jsonwebtoken";
import { Server } from "restify";
import { UnauthorizedError } from "restify-errors";
import JwtValidationError from "./error/jwtValidationError";
import GenericController from "./genericController";

export default class JwtValidationFilter extends GenericController {
    constructor() {
        super();
    }
    public createRoutes(server: Server) {
        server.pre((request: Request, response: Response, next: NextFunction) => {
            const authorizationHeader = request.header("Authorization");
            if (authorizationHeader !== undefined) {
                const authorizationHeaderPattern = /Bearer (.+\..+\.\S+)/g;
                const tokenMatch = authorizationHeaderPattern.exec(authorizationHeader);
                if (tokenMatch.length === 2) {
                    verify(tokenMatch[1], fs.readFileSync("conf/jwtPublicKey.pem"),
                        { algorithms: ["RS256"], audience: "intranet-sp-framework" },
                        (error, decoded) => {
                            if (error) {
                                next(new JwtValidationError(error.name, error.message));
                            } else {
                                next();
                            }
                        });
                    return;
                }
            }
            next(new UnauthorizedError(i18n.__("401.default")));
        });
    }
}

Object.seal(JwtValidationFilter);
