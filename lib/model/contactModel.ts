import { Schema } from "mongoose";
import EntityModel from "./entityModel";

export default class ContactModel extends EntityModel {
    public static schema: Schema = new Schema({
        first_name: {
            type: String,
            required: "Mandatory field",
        },
        last_name: {
            type: String,
            required: "Mandatory field",
        },
        email: {
            type: String,
        },
        company: {
            type: String,
        },
        phone: {
            type: Number,
        },
        creation_date: {
            type: Date,
            default: Date.now,
        },
        modification_date: {
            type: Date,
            default: Date.now,
        },
    });

    constructor() {
        super("Contact", ContactModel.schema, "contact");
    }
}

Object.seal(ContactModel);
