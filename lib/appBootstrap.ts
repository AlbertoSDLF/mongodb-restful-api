import * as dotenv from "dotenv";
import * as i18n from "i18n";
import * as mongoose from "mongoose";
import * as restify from "restify";
import * as logger from "winston";
import { ContactController as ContactControllerV110 } from "./controller/contact/v1.1.0/contactController";
import ErrorController from "./controller/errorController";
import GenericController from "./controller/genericController";
import LoggingFilter from "./controller/loggingFilter";

class AppBootstrap {
    private server: restify.Server;
    private version: string;

    public initialize(): restify.Server {
        dotenv.config();
        this.configureLogger();
        this.setupMongoDb();
        this.configureServer();
        this.setupControllers();
        return this.server;
    }

    private configureServer(): void {
        this.server = restify.createServer({
            ignoreTrailingSlash: true,
        });
        this.server.use(restify.plugins.acceptParser(["application/json"]));
        this.server.use(restify.plugins.jsonBodyParser({ mapParams: true }));
        this.server.use(restify.plugins.queryParser({ mapParams: true }));
        this.server.use(restify.plugins.fullResponse());
        i18n.configure({
            directory: "messages",
            locales: ["en"],
        });
    }

    private configureLogger(): void {
        // Remove default console logger
        logger.remove(logger.transports.Console);
        if (process.env.NODE_ENV !== "Test") {
            logger.add(logger.transports.Console, {
                json: true,
                level: "info",
                name: "console",
            });
            const fs = require("fs");
            const logFolder = "./log";
            if (!fs.existsSync(logFolder)) {
                fs.mkdirSync(logFolder);
            }
            logger.add(logger.transports.File, {
                filename: `${logFolder}/node_mongodb_restify.log`,
                json: true,
                level: "info",
                maxFiles: "20",
                maxsize: 5242880,
                name: "file-default",
                zippedArchive: false,
            });
        }
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
            autoIndex: false, // Don"t build indexes
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
            // new JwtValidationFilter(),
            new LoggingFilter(),
            new ErrorController(),
            new ContactControllerV110("/api/contact"),
        ];
        controllers.forEach((controller: GenericController) => {
            controller.createRoutes(this.server);
        });
    }
}

export default new AppBootstrap().initialize();
