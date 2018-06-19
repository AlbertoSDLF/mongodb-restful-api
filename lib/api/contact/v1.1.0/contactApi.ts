import { plugins, Server } from "restify";
import { ContactController as ContactControllerV1_0_0 } from "../../../controller/contact/v1.0.0/contactController";
import { ContactController as ContactControllerV1_1_0 } from "../../../controller/contact/v1.1.0/contactController";
import IEntityApi from "../../iEntityApi";

export default class ContactApi implements IEntityApi {
    private readonly contactController100: ContactControllerV1_0_0 = new ContactControllerV1_0_0();
    private readonly contactController110: ContactControllerV1_1_0 = new ContactControllerV1_1_0();

    public createRoutes(server: Server): void {
        server.get("/api/contact", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.find },
            { version: this.contactController110.getVersions(), handler: this.contactController110.find },
        ]));
        server.get("/api/contact/count", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.count },
            { version: this.contactController110.getVersions(), handler: this.contactController110.count },
        ]));
        server.post("/api/contact", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.add },
            { version: this.contactController110.getVersions(), handler: this.contactController110.add },
        ]));
        server.get("/api/contact/:id", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.get },
            { version: this.contactController110.getVersions(), handler: this.contactController110.get },
        ]));
        server.get("/api/contact/:id/:id/exists", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.exists },
            { version: this.contactController110.getVersions(), handler: this.contactController110.exists },
        ]));
        server.put("/api/contact/:id", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.update },
            { version: this.contactController110.getVersions(), handler: this.contactController110.update },
        ]));
        server.del("/api/contact/:id", plugins.conditionalHandler([
            { version: this.contactController100.getVersions(), handler: this.contactController100.delete },
            { version: this.contactController110.getVersions(), handler: this.contactController110.delete },
        ]));
    }
}
