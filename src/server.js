import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errors } from "celebrate";

import { connectMongoDB } from "./db/connectMongoDB.js";
import notesRouter from "./routes/notesRoutes.js";
import authRouter from "./routes/authRoutes.js";
import { logger } from "./middleware/logger.js";
import { notFoundHandler } from "./middleware/notFoundHandler.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(logger);
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(authRouter);
app.use(notesRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectMongoDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
  }
};

startServer();
