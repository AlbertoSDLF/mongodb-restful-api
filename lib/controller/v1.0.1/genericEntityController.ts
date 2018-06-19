import * as HttpStatus from "http-status-codes";
import { Next, Request, Response, Server } from "restify";
import EntityModel from "../../model/entityModel";
import Options from "../conf/options";
import EntityNotFoundError from "../error/entityNotFoundError";
import MongodbError from "../error/mongodbError";
import { GenericEntityController as ControllerV1_0_0} from "../V1.0.0/genericEntityController";

export class GenericEntityController extends ControllerV1_0_0 {
    constructor(contextPath: string, model: EntityModel, isLatest: boolean) {
        super(contextPath);
        this.model = model;
        this.options = new Options("1.0.0", isLatest);
    }

    public createRoutes(server: Server): void {
        for (const contextPath of this.getContextPaths()) {
            server.get(contextPath, this.find);
            server.get(`${contextPath}/count`, this.count);
            server.post(contextPath, this.add);
            server.get(`${contextPath}/:id`, this.get);
            server.get(`${contextPath}/:id/exists`, this.exists);
            server.put(`${contextPath}/:id`, this.update);
            server.del(`${contextPath}/:id`, this.delete);
        }
    }

    private getContextPaths(): string[] {
        const paths: string[] = [`${this.contextPath.replace("{version}", "v" + this.options.getVersion())}`];
        if (this.options.getIsLatest()) {
            paths.push(`${this.contextPath.replace("/{version}", "")}`);
        }
        return paths;
    }

    private add = (request: Request, response: Response, next: Next): void => {
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

    private find = (request: Request, response: Response, next: Next): void => {
        const pageNumber: number = +request.header("page-number");
        const pageSize: number = +request.header("page-size");
        const skip: number = (pageNumber - 1) * pageSize;
        const sort: string = request.header("sort");
        const sortOrder: number = +request.header("sort-order");
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.status(HttpStatus.OK);
            response.send(foundEntities);
            next();
        })/* .limit(pageSize).skip(skip).sort({ [sort]: sortOrder }) */;
    }

    private count = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.status(HttpStatus.OK);
            response.send({ total: Object.keys(foundEntities).length });
            next();
        }).select("_id");
    }

    private get = (request: Request, response: Response, next: Next): void => {
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

    private exists = (request: Request, response: Response, next: Next): void => {
        this.model.getDbModel().findById(request.params.id, (error, retrievedEntity) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.send(HttpStatus.NO_CONTENT);
            next();
        });
    }

    private update = (request: Request, response: Response, next: Next): void => {
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

    private delete = (request: Request, response: Response, next: Next): void => {
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
