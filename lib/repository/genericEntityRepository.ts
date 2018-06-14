import * as HttpStatus from "http-status-codes";
import EntityModel from "../model/entityModel";
import { model } from "mongoose";

export default class GenericEntityRepository<T extends EntityModel> {
    private entityModel: T;

    constructor(entityModel: T) {
        this.entityModel = entityModel;
    }

    public dbAdd = (entity: model, callback: (error: any, createdEntity: any) => void): void => {
        const newEntity = this.entityModel.getDbModel()(entity);
        newEntity.save((error, createdEntity) => {
            callback(error, createdEntity);
        });
    }

    public dbFind = (callback: (error: any, foundEntities: any) => void): void => {
        this.entityModel.getDbModel().find({}, (error, foundEntities) => {
            callback(error, foundEntities);
        });
    }

    public dbGet = (id: string, callback: (error: any, retrievedEntity: any) => void): void => {
        this.entityModel.getDbModel().findById(id, (error, retrievedEntity) => {
            callback(error, retrievedEntity);
        });
    }

    public dbUpdate = (entity: model, callback: (error: any, retrievedEntity: any) => void): void => {
        this.entityModel.getDbModel().findOneAndUpdate({ _id: entity._id },
            entity, { new: true }, (error, updatedEntity) => {
                callback(error, updatedEntity);
            });
    }

    public dbDelete = (entity: model, callback: (error: any, deletedEntity: any) => void): void => {
        this.entityModel.getDbModel().remove({ _id: entity._id }, (error, deletedEntity) => {
            callback(error, deletedEntity);
        });
    }
}