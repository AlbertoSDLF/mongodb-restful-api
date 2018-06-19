import ContactModel from "../../../model/contactModel";
import EntityController from "../../entityController";

export class ContactController extends EntityController {
    protected versions: string[] = ["1.0.0"];

    constructor() {
        super(new ContactModel());
    }

    // Override/add all methods needed
}
