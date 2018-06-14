import { injectable, inject } from "inversify";
import EntityModel from "../model/entityModel";
import "reflect-metadata";
import { Request, Response } from "restify";
import GenericEntityRepository from "../repository/genericEntityRepository";
import ContactModel from "../model/contactModel";

export default class ContactController extends GenericEntityRepository<ContactModel> {
    constructor(entityModel: ContactModel) {
        super(entityModel);
    }

    protected findAll(request: Request, response: Response): string {
        return "Hi " + request.params["id"];
    }

    protected getById(request: Request, response: Response): string {
        return "Hi " + request.params["id"];
    }

    public create(request: Request, response: Response): string {
        return "Got event " + request.params["id"];
    }

    public update(request: Request, response: Response): string {
        return "Got event " + request.params["id"];
    }

    public delete(request: Request, response: Response): string {
        return "Got event " + request.params["id"];
    }
}