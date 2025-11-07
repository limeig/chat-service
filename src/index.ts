import express from "express";
import type { Request, Response } from "express";

import cors from "cors";

import handlers from './handlers.ts';

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // адрес фронтенда
    methods: ["GET", "POST"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

app.use(express.json());

//Routes
const router = express.Router();

router.get("/",     handlers.getMessagesHandler);
router.get("/poll", handlers.pollMessagesHandler);
router.post("/",    handlers.postMessageHandler);

app.use("/messages", router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
