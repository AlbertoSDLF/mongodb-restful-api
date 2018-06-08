import { model, Schema } from "mongoose";
import { injectable } from "inversify";

export default class EntityModel {
    protected readonly name: string;
    protected readonly schema: Schema;
    protected readonly dbCollectionName: string;

    constructor(name: string, schema: Schema, dbCollectionName: string) {
        this.name = name;
        this.schema = schema;
        this.dbCollectionName = dbCollectionName;
    }

    public getDbModel(): model {
        return model(this.name, this.schema, this.dbCollectionName);
    }
    public getName(): string {
        return this.name;
    }
}
