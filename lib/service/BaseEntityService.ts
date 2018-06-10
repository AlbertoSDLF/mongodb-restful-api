import { Inject } from '@nestjs/common';
import { Document } from 'mongoose';
import BaseRepository from '../repository/BaseRepository';

export default class BaseEntityService<T extends Document> {
    private repository: BaseRepository<T>;

    constructor(repository: BaseRepository<T>) {
        this.repository = repository;
    }

    create(entity: T, callback: (error: any, result: any) => void) {
        this.repository.create(entity, callback);
    }

    retrieve(callback: (error: any, result: any) => void) {
        this.repository.retrieve(callback);
    }

    update(id: string, entity: T, callback: (error: any, result: any) => void) {
        this.repository.findById(id, (err, res) => {
            if (err) {
                callback(err, res);
            } else {
                this.repository.update(res._id, entity, callback);
            }
        });
    }

    delete(id: string, callback: (error: any, result: any) => void) {
        this.repository.delete(id, callback);
    }

    findById(id: string, callback: (error: any, result: T) => void) {
        return this.repository.findById(id, callback);
    }
}