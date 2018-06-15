import * as HttpStatus from "http-status-codes";
import { Next, Request, Response, Server } from "restify";
import EntityModel from "../model/entityModel";
import EntityNotFoundError from "./error/entityNotFoundError";
import MongodbError from "./error/mongodbError";
import GenericController from "./genericController";

export default class GenericEntityController<T extends EntityModel> extends GenericController {
    private model: T;

    constructor(contextPath: string, model: T) {
        super(contextPath);
        this.model = model;
    }

    public createRoutes(server: Server): void {
        server.get(this.contextPath, this.find);
        server.post(this.contextPath, this.add);
        server.get(`${this.contextPath}/:id`, this.get);
        server.get(`${this.contextPath}/:id/exists`, this.exists);
        server.put(`${this.contextPath}/:id`, this.update);
        server.del(`${this.contextPath}/:id`, this.delete);
    }

    private add = (request: Request, response: Response, next: Next): void => {
        const newEntity = this.model.getDbModel()(request.body);
        newEntity.save((error, createdEntity) => {
            if (error) {
                next(new MongodbError(this.model.getName(), error.name, error.message));
                return;
            }
            response.status(HttpStatus.CREATED);
            response.send(createdEntity);
            next();
        });
    }

    private find = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                next(new MongodbError(this.model.getName(), error.name, error.message));
                return;
            }
            response.status(HttpStatus.OK);
            response.send(foundEntities);
            next();
        });
    }

    private get = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findById(request.params.id, (error, retrievedEntity) => {
            if (error) {
                next(new MongodbError(this.model.getName(), error.name, error.message));
                return;
            }
            if (retrievedEntity === null) {
                next(new EntityNotFoundError(this.model.getName(), request.params.id));
                return;
            }
            response.status(HttpStatus.OK);
            response.send(retrievedEntity);
            next();
        });
    }

    private exists = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findById(request.params.id, (error, retrievedEntity) => {
            if (error) {
                next(new MongodbError(this.model.getName(), error.name, error.message));
                return;
            }
            response.send(HttpStatus.NO_CONTENT);
            next();
        });
    }

    private update = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findOneAndUpdate({ _id: request.params.id },
            request.body, { new: true }, (error, updatedEntity) => {
                if (error) {
                    next(new MongodbError(this.model.getName(), error.name, error.message));
                    return;
                }
                if (updatedEntity === null) {
                    next(new EntityNotFoundError(this.model.getName(), request.params.id));
                    return;
                }
                response.status(HttpStatus.OK);
                response.send(updatedEntity);
                next();
            });
    }

    private delete = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().remove({ _id: request.params.id }, (error, result) => {
            if (error) {
                next(new MongodbError(this.model.getName(), error.name, error.message));
                return;
            }
            if (result.n !== 1) {
                next(new EntityNotFoundError(this.model.getName(), request.params.id));
                return;
            }
            response.send(HttpStatus.NO_CONTENT);
            next();
        });
    }
}
