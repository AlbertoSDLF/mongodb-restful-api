import { Server } from "restify";

export default abstract class GenericController {
    protected contextPath: string = "/";

    constructor(contextPath?: string) {
        this.contextPath = contextPath;
    }

    public abstract createRoutes(server: Server): void;
}
