import * as HttpStatus from "http-status-codes";
import { Next, plugins, Request, Response, Server } from "restify";
import EntityModel from "../model/entityModel";
import EntityNotFoundError from "./error/entityNotFoundError";
import MongodbError from "./error/mongodbError";
import GenericController from "./genericController";

export default abstract class EntityController extends GenericController {
    protected model: EntityModel;
    protected contextPath: string;
    protected versions: string[] = [];

    constructor(contextPath: string, model: EntityModel) {
        super(contextPath);
        this.contextPath = contextPath;
        this.model = model;
    }

    public abstract createRoutes(server: Server): void;

    public addVersion(version: string): void {
        this.versions.push(version);
    }

    public add = (request: Request, response: Response, next: Next): void => {
        const newEntity = this.model.getDbModel()(request.body);
        newEntity.save((error, createdEntity) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.status(HttpStatus.CREATED);
            response.send(createdEntity);
            next();
        });
    }

    public find = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.status(HttpStatus.OK);
            response.send(foundEntities);
            next();
        });
    }

    public count = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.status(HttpStatus.OK);
            response.send({ total: Object.keys(foundEntities).length });
            next();
        }).select("_id");
    }

    public get = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findById(request.params.id, (error, retrievedEntity) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            if (retrievedEntity === null) {
                return next(new EntityNotFoundError(this.model.getName(), request.params.id));
            }
            response.status(HttpStatus.OK);
            response.send(retrievedEntity);
            next();
        });
    }

    public exists = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findById(request.params.id, (error, retrievedEntity) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.send(HttpStatus.NO_CONTENT);
            next();
        });
    }

    public update = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findOneAndUpdate({ _id: request.params.id },
            request.body, { new: true }, (error, updatedEntity) => {
                if (error) {
                    return next(new MongodbError(this.model.getName(), error.name, error.message));
                }
                if (updatedEntity === null) {
                    return next(new EntityNotFoundError(this.model.getName(), request.params.id));
                }
                response.status(HttpStatus.OK);
                response.send(updatedEntity);
                next();
            });
    }

    public delete = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().remove({ _id: request.params.id }, (error, result) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            if (result.n !== 1) {
                return next(new EntityNotFoundError(this.model.getName(), request.params.id));
            }
            response.send(HttpStatus.NO_CONTENT);
            next();
        });
    }
}
