import { plugins, Server } from "restify";
import ContactModel from "../../../model/contactModel";
import EntityController from "../../entityController";

export class ContactController extends EntityController {
    constructor(contextPath: string) {
        super(contextPath, new ContactModel());
        this.addVersion("1.0.0");
    }

    public createRoutes(server: Server): void {
        server.get("/api/contact", plugins.conditionalHandler([
            { version: this.versions, handler: this.find },
        ]));
        server.get("/api/contact/count", plugins.conditionalHandler([
            { version: this.versions, handler: this.count },
        ]));
        server.post("/api/contact", plugins.conditionalHandler([
            { version: this.versions, handler: this.add },
        ]));
        server.get("/api/contact/:id", plugins.conditionalHandler([
            { version: this.versions, handler: this.get },
        ]));
        server.get("/api/contact/:id/:id/exists", plugins.conditionalHandler([
            { version: this.versions, handler: this.exists },
        ]));
        server.put("/api/contact/:id", plugins.conditionalHandler([
            { version: this.versions, handler: this.update },
        ]));
        server.del("/api/contact/:id", plugins.conditionalHandler([
            { version: this.versions, handler: this.delete },
        ]));
    }
}
