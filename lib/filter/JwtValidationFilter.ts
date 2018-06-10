import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as i18n from 'i18n';
import { Observable } from 'rxjs';

@Injectable()
export class JwtValidationFilter implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const authorizationHeader = request.header('Authorization');
        if (authorizationHeader !== undefined) {
            let authorizationHeaderPattern = /Bearer (.+\..+\..+)/gm;
            let tokenMatch = authorizationHeaderPattern.exec(authorizationHeader);
            if (tokenMatch.length === 2) {
                // verify(tokenMatch[1], fs.readFileSync('configuration/public.pem'), { algorithms: ['RS256'], audience: 'intranet-sp-framework' }, function (err, decoded) {
                //     if (err) {
                //         return res.json({ message: 'Failed to authenticate token.', details: err });
                //     } else {
                //         res.locals.jwtPayload = decoded;
                //         next();
                //     }
                // });
                return true;
            }
        }
        throw new HttpException(i18n.__('401.default'), HttpStatus.UNAUTHORIZED);
    }
}

Object.seal(JwtValidationFilter);