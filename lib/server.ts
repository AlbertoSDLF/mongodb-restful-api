import * as logger from "winston";
import AppBootstrap from "./appBootstrap";

const port = 3000;

const appBoostrap: AppBootstrap = new AppBootstrap();
appBoostrap.initialize().listen(port, (error) => {
    if (error) {
        logger.error(`Application failed to start on port ${port}`);
    } else {
        logger.info(`Application started on port ${port}`);
    }
});
