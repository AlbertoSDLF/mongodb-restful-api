import * as i18n from "i18n";
import { NotFoundError } from "restify-errors";

export default class EntityNotFoundError extends NotFoundError {
    constructor(entityName: string, entityId: string) {
        super(i18n.__("404.entityNotFound", entityName, entityId));
    }
}
