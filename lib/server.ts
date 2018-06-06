import * as logger from "winston";
import app from "./app";

const port = 3000;

app.listen(port, (error) => {
    if (error) {
        logger.error(`Application failed to start on port ${port}`);
    } else {
        logger.info(`Application started on port ${port}`);
    }
});
