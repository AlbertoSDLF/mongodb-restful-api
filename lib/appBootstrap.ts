import * as dotenv from "dotenv";
import * as i18n from "i18n";
import * as mongoose from "mongoose";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as logger from "winston";
import ErrorController from "./controller/errorController";
import GenericController from "./controller/genericController";
import GenericEntityController from "./controller/genericEntityController";
import RequestLoggingFilter from "./controller/requestLoggingFilter";
import ResponseLoggingFilter from "./controller/responseLoggingFilter";
import ContactModel from "./model/contactModel";

export default class AppBootstrap {
    private server: restify.Server;

    public initialize(): restify.Server {
        dotenv.config();
        this.configureLogger();
        this.setupMongoDb();
        this.configureServer();
        this.setupControllers();
        return this.server;
    }

    private configureServer(): void {
        this.server = restify.createServer();
        this.server.use(restify.plugins.acceptParser(["application/json"]));
        this.server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
        this.server.use(restifyPlugins.queryParser({ mapParams: true }));
        this.server.use(restifyPlugins.fullResponse());
        i18n.configure({
            directory: "messages",
            locales: ["en"],
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
        mongoose.connect(process.env.mongodbUrl, {
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
            new RequestLoggingFilter(),
            // new JwtValidationFilter(),
            new ResponseLoggingFilter(),
            new ErrorController(),
            new GenericEntityController("/api/contact", new ContactModel()),
        ];
        controllers.forEach((controller: GenericController) => {
            controller.createRoutes(this.server);
        });
    }
}
