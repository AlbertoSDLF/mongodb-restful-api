import * as i18n from "i18n";
import * as mongoose from "mongoose";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as logger from "winston";
import GenericController from "./controller/genericController";
import GenericEntityController from "./controller/genericEntityController";
import JwtValidationFilter from "./controller/jwtValidationFilter";
import RequestLoggingFilter from "./controller/requestLoggingFilter";
import ResponseLoggingFilter from "./controller/responseLoggingFilter";
import ContactModel from "./model/contactModel";

export default class AppBootstrap {
    private server: restify.Server;
    private readonly mongoUrl: string = "mongodb://localhost/nodejs";

    public initialize(): restify.Server {
        this.server = restify.createServer();
        this.server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
        this.server.use(restifyPlugins.acceptParser( this.server.acceptable));
        this.server.use(restifyPlugins.queryParser({ mapParams: true }));
        this.server.use(restifyPlugins.fullResponse());
        this.configure();
        this.setupMongoDb();
        this.setupControllers();
        return this.server;
    }

    private configure(): void {
        this.configureLogger();
        i18n.configure({
            locales: ["en"],
            directory: "messages",
        });
    }

    private configureLogger(): void {
        // Remove default console logger
        logger.remove(logger.transports.Console);
        // And add a custom one replacing it, in non Production environments
        if (process.env.NODE_ENV !== "production") {
            logger.add(logger.transports.Console, {
                json: true,
                level: "debug",
                name: "console",
            });
        }
        // Production logger
        const fs = require("fs");
        const logFolder = "./log";
        if (!fs.existsSync(logFolder)) {
            fs.mkdirSync(logFolder);
        }
        logger.add(logger.transports.File, {
            filename: `${logFolder}/error.log`,
            json: true,
            level: "error",
            maxFiles: "20",
            maxsize: 5242880, // 5MB
            name: "error",
        });
        logger.add(logger.transports.File, {
            filename: `${logFolder}/default.log`,
            json: true,
            level: "debug",
            maxFiles: "20",
            maxsize: 5242880,
            name: "default",
            zippedArchive: true,
        });
    }

    private setupMongoDb(): void {
        mongoose.Promise = global.Promise;
        mongoose.connection.on("connected", () => {
            logger.info("DB connection established");
        });
        mongoose.connection.on("error", (error) => {
            logger.error(`DB connection failed with error: ${error}`);
            process.exit();
        });
        mongoose.connection.on("disconnected", () => {
            logger.info("DB connection finished");
        });
        mongoose.connect(this.mongoUrl, {
            autoIndex: false, // Don't build indexes
            bufferCommands: 0,
            bufferMaxEntries: 0, // If not connected, return errors immediately rather than waiting for reconnect
            keepAlive: 200,
            poolSize: 100, // Maintain up to 100 socket connections
            reconnectInterval: 500, // Reconnect every 500ms
            reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
        });
    }

    private setupControllers() {
        const controllers: GenericController[] = [
            new JwtValidationFilter(),
            new RequestLoggingFilter(),
            new ResponseLoggingFilter(),
            new GenericEntityController("/api/contact", new ContactModel()),
        ];
        controllers.forEach((controller: GenericController) => {
            controller.createRoutes(this.server);
        });
    }
}
