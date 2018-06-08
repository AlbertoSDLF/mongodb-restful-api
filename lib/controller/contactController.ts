import { injectable, inject } from "inversify";
import { Controller, Delete, Get, Post, Put, interfaces } from "inversify-restify-utils";
import EntityModel from "../model/entityModel";
import "reflect-metadata";
import { Request, Response } from "restify";
import GenericEntityRepository from "../repository/genericEntityRepository";

@Controller("/api/contact")
@injectable()
export default class ContactController<T extends EntityModel> extends GenericEntityRepository<T> implements interfaces.Controller {
    constructor(@inject('EntityModel') entityModel: T) {
        super(entityModel);
    }

    @Get("/")
    protected findAll(request: Request, response: Response): string {
        return "Hi " + request.params["id"];
    }

    @Get("/:id")
    protected getById(request: Request, response: Response): string {
        return "Hi " + request.params["id"];
    }

    @Post("/")
    public create(request: Request, response: Response): string {
        return "Got event " + request.params["id"];
    }

    @Put("/")
    public update(request: Request, response: Response): string {
        return "Got event " + request.params["id"];
    }

    @Delete("/:id")
    public delete(request: Request, response: Response): string {
        return "Got event " + request.params["id"];
    }
}