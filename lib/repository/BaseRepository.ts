import { Document, Model, Types } from 'mongoose';
import IReadRepository from './IReadRepository';
import IWriteRepository from './IWriteRepository';

export default class BaseRepository<T extends Document> implements IReadRepository<T>, IWriteRepository<T> {
    private model: Model<T>;

    constructor(schemaModel: Model<T>) {
        this.model = schemaModel;
    }

    create(item: T, callback: (error: any, result: any) => void) {
        this.model.create(item, callback);
    }

    retrieve(callback: (error: any, result: any) => void) {
        this.model.find({}, callback);
    }

    update(id: Types.ObjectId, item: T, callback: (error: any, result: any) => void) {
        this.model.update({ _id: id }, item, callback);
    }

    delete(id: string, callback: (error: any, result: any) => void) {
        this.model.remove({ _id: this.toObjectId(id) }, (err) => callback(err, null));
    }

    async findById(id: string, callback: (error: any, result: T) => void) {
        this.model.findById(id, callback);
    }

    private toObjectId(id: string): Types.ObjectId {
        return Types.ObjectId.createFromHexString(id);
    }
}