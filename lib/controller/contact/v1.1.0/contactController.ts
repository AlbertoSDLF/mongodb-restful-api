import * as HttpStatus from "http-status-codes";
import { Next, plugins, Request, Response, Server } from "restify";
import MongodbError from "../../error/mongodbError";
import { ContactController as ContactControllerV1_0_0 } from "../v1.0.0/contactController";

export class ContactController extends ContactControllerV1_0_0 {
    constructor(contextPath: string) {
        super(contextPath);
        this.addVersion("1.1.0");
    }

    public createRoutes(server: Server): void {
        server.get("/api/contact", plugins.conditionalHandler([
            { version: "1.0.0", handler: this.find },
            { version: "1.1.0", handler: this.find110 },
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
        server.get("/api/contact/:id/exists", plugins.conditionalHandler([
            { version: this.versions, handler: this.exists },
        ]));
        server.put("/api/contact/:id", plugins.conditionalHandler([
            { version: this.versions, handler: this.update },
        ]));
        server.del("/api/contact/:id", plugins.conditionalHandler([
            { version: this.versions, handler: this.delete },
        ]));
    }

    public find110 = (request: Request, response: Response, next: Next): void => {
        const pageNumber: number = +request.header("page-number");
        const pageSize: number = +request.header("page-size");
        const skip: number = (pageNumber - 1) * pageSize;
        const sort: string = request.header("sort");
        const sortOrder: number = +request.header("sort-order");
        let sortConf;
        if (sort) {
            sortConf = { [sort]: sortOrder ? sortOrder : 1};
        }
        this.model.getDbModel().find({}, (error, foundEntities) => {
            if (error) {
                return next(new MongodbError(this.model.getName(), error.name, error.message));
            }
            response.status(HttpStatus.OK);
            response.send(foundEntities);
            next();
        }).limit(pageSize).skip(skip).sort(sortConf);
    }
}
