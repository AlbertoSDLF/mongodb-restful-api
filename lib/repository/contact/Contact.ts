import { Document, Schema, model } from 'mongoose';

export interface IContact {
    first_name: String;
    last_name: String;
    email?: String;
    company?: String;
    phone?: Number;
    creation_date?: Date;
    modification_date?: Date;
}

export interface IContactModel extends IContact, Document {
}

export let ContactSchema = new Schema({
    first_name: {
        type: String,
        required: 'Mandatory field'
    },
    last_name: {
        type: String,
        required: 'Mandatory field'
    },
    email: {
        type: String
    },
    company: {
        type: String
    },
    phone: {
        type: Number
    },
    creation_date: {
        type: Date,
        default: Date.now
    },
    modification_date: {
        type: Date,
        default: Date.now
    }
})/* .post('retrieve', (next) => {
    if (this._doc) {
        let doc = <IContactModel>this._doc;
        if (!doc.creationDate) {
            doc.creationDate = new Date();
        }
    }
    next();
    return this;
}) */;

export let ContactModel = model<IContactModel>('Contact', ContactSchema, 'contact', true);