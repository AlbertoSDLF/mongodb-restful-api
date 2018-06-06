import * as bodyParser from "body-parser";
import GenericController from "controller/genericController";
import * as express from "express";
import * as i18n from "i18n";
import * as mongoose from "mongoose";
import * as logger from "winston";
import ErrorController from "./controller/errorController";
import GenericEntityController from "./controller/genericEntityController";
import JwtValidationFilter from "./controller/JwtValidationFilter";
import RequestLoggingFilter from "./controller/RequestLoggingFilter";
import ResponseLoggingFilter from "./controller/ResponseLoggingFilter";
import ContactModel from "./model/contactModel";

class App {
    public readonly app: express.Application;
    private readonly mongoUrl: string = "mongodb://localhost/nodejs";

    constructor() {
        this.app = express();
        this.configure();
        this.setupMongoDb();
        this.setupControllers();
    }

    private configure(): void {
        this.configureLogger();
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
        this.app.use(express.static("public"));
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
        });
        mongoose.connection.on("disconnected", () => {
            logger.error("DB connection finished");
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
        // Order of controllers in the array is important
        const controllers: GenericController[] = [
            new RequestLoggingFilter("/"),
            new JwtValidationFilter("/api"),
            new GenericEntityController("/api/contact", new ContactModel()),
            new ErrorController(),
            new ResponseLoggingFilter("/"),
        ];
        controllers.forEach((controller: GenericController) => {
            controller.createRoutes(this.app);
        });
    }
}

export default new App().app;
