import { Server } from "restify";

export default interface IEntityApi {
    createRoutes(server: Server): void;
}
