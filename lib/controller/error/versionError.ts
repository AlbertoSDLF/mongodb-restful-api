import { BadRequestError } from "restify-errors";

export default class VersionError extends BadRequestError {
    constructor() {
        super();
    }
}
