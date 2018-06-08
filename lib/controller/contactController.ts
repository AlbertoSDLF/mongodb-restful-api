import { injectable } from "inversify";
import { Controller, Delete, Get, Post, Put, interfaces } from "inversify-restify-utils";
import "reflect-metadata";
import { Request, Response } from "restify";

@Controller("/api/contact")
@injectable()
export default class ContactController implements interfaces.Controller {
    @Get("/")
    protected findAll(request: Request, response: Response): string {
        return "Hi " + request.params["id"];
    }

    @Get("/:id")
    protected getById(request: Request): string {
        return "Hi " + request.params["id"];
    }

    @Post("/")
    public create(request: Request): string {
        return "Got event "+ request.params["id"];
    }

    @Put("/")
    public update(request: Request): string {
        return "Got event "+ request.params["id"];
    }

    @Delete("/:id")
    public delete(request: Request): string {
        return "Got event "+ request.params["id"];
    }
}