import * as i18n from "i18n";
import { Container } from 'inversify';
import { InversifyRestifyServer, TYPE, interfaces } from 'inversify-restify-utils';
import * as mongoose from "mongoose";
import * as logger from "winston";
import ContactController from "./controller/contactController";

export default class AppBootstrap {
    private app: any;
    private readonly mongoUrl: string = "mongodb://localhost/nodejs";

    public initialize(): any {
        let container: Container = new Container();
        container.bind<interfaces.Controller>(TYPE.Controller).to(
            ContactController).whenTargetNamed('ContactController');
        let server: InversifyRestifyServer = new InversifyRestifyServer(container);
        this.app = server.build();
        this.configure();
        this.setupMongoDb();
        return this.app;
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
}
