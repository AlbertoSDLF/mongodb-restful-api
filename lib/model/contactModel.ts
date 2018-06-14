import { Schema } from "mongoose";
import EntityModel from "./entityModel";

export default class ContactModel extends EntityModel {
    public static schema: Schema = new Schema({
        company: {
            type: String,
        },
        creation_date: {
            default: Date.now,
            type: Date,
        },
        email: {
            type: String,
        },
        first_name: {
            required: "Mandatory field",
            type: String,
        },
        last_name: {
            required: "Mandatory field",
            type: String,
        },
        modification_date: {
            default: Date.now,
            type: Date,
        },
        phone: {
            type: Number,
        },
    });

    constructor() {
        super("Contact", ContactModel.schema, "contact");
    }
}

Object.seal(ContactModel);
