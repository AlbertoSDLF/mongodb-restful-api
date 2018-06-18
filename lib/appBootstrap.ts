import * as dotenv from "dotenv";
import * as i18n from "i18n";
import * as mongoose from "mongoose";
import * as restify from "restify";
import * as restifyPlugins from "restify-plugins";
import * as versioning from "restify-url-semver";
import * as logger from "winston";
import ErrorController from "./controller/errorController";
import GenericController from "./controller/genericController";
import GenericEntityController from "./controller/genericEntityController";
import LoggingFilter from "./controller/loggingFilter";
import ContactModel from "./model/contactModel";

class AppBootstrap {
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
        this.server = restify.createServer({
            ignoreTrailingSlash: true,
            version: "1.0.0",
        });
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
        this.server.pre(versioning({ prefix: "/api" }));
        const controllers: GenericController[] = [
            // new JwtValidationFilter(),
            new LoggingFilter(),
            new ErrorController(),
            new GenericEntityController("/contact", new ContactModel()),
        ];
        controllers.forEach((controller: GenericController) => {
            controller.createRoutes(this.server);
        });
    }
}

export default new AppBootstrap().initialize();
