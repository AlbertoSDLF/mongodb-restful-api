import { Application, NextFunction, Request, Response } from "express";
import * as HttpStatus from "http-status-codes";
import GenericModel from "../model/genericModel";
import GenericController from "./genericController";

export default class GenericEntityController extends GenericController {
    private model: GenericModel;

    constructor(contextPath: string, model: GenericModel) {
        super(contextPath);
        this.model = model;
    }

    public add = (request: Request, response: Response, next: NextFunction): void => {
        const newEntity = this.model.getDbModel()(request.body);
        newEntity.save((error, createdEntity) => {
            if (error) {
                next(error);
                return;
            }
            response.status(HttpStatus.CREATED).json(createdEntity);
            next();
        });
    }

    public find = (request: Request, response: Response, next: NextFunction): void => {
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                response.send(error);
            }
            response.json(foundEntities);
            next();
        });
    }

    public get = (request: Request, response: Response, next: NextFunction): void => {
        //        if (!response.headersSent) {
        this.model.getDbModel().findById(request.params.id, (error, retrievedEntity) => {
            if (error) {
                next(error);
                return;
            }
            if (retrievedEntity === null) {
                next(new Error(`EntityNotFound-${this.model.getName()}-${request.params.id}`));
                return;
            }
            response.status(HttpStatus.OK).json(retrievedEntity);
            next();
        });
        //        }
    }

    public update = (request: Request, response: Response, next: NextFunction): void => {
        this.model.getDbModel().findOneAndUpdate({ _id: request.params.id },
            request.body, { new: true }, (error, updatedEntity) => {
                if (error) {
                    response.send(error);
                }
                response.json(updatedEntity);
                next();
            });
    }

    public delete = (request: Request, response: Response, next: NextFunction): void => {
        this.model.getDbModel().remove({ _id: request.params.id }, (error, deletedEntity) => {
            if (error) {
                response.send(error);
            }
            response.json({ message: "Successfully deleted entity!" });
            next();
        });
    }

    public createRoutes(app: Application): void {
        app.route(this.contextPath)
            .get((request: Request, response: Response, next: NextFunction) => {
                next();
            }, this.find)
            .post(this.add);
        app.route(`${this.contextPath}/:id`)
            .get(this.get)
            .put(this.update)
            .delete(this.delete);
    }
}
