import "dotenv/config";
import express from "express";
import cors from "cors";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRouter from "./routes/notesRoutes.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors());
app.use(express.json());

app.use(notesRouter);

app.use(errors());

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  await connectMongoDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
