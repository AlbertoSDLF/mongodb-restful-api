import "reflect-metadata";
import ContactModel from "../model/contactModel";
import GenericEntityController from './genericEntityController';

export default class ContactController extends GenericEntityController<ContactModel> {
    constructor(contextPath: string, entityModel: ContactModel) {
        super(contextPath, entityModel);
    }
}