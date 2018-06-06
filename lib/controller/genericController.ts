import { Application } from "express";

export default abstract class GenericController {
    protected contextPath: string = "/";

    constructor(contextPath?: string) {
        this.contextPath = contextPath;
    }

    public abstract createRoutes(app: Application): void;
}
