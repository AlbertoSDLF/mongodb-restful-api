import * as logger from "winston";
import server from "./appBootstrap";

const port = 3000;

server.listen(port, (error) => {
    if (error) {
        logger.error(`Application failed to start on port ${port}`);
    } else {
        logger.info(`Application started on port ${port}`);
    }
});
