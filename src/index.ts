import express from "express";
import type { Request, Response } from "express";

import cors from "cors";
import events from "events";

process.on("uncaughtException", console.error);
process.on("unhandledRejection", console.error);

const app = express();
const PORT = process.env.PORT || 5000;

class Message {
  text: string;
  sender: string;
  constructor(text: string, sender: string) {
    this.text = text;
    this.sender = sender;
  }
}

const MAX_CHAT_USERS: number = 100;

const NEW_MESSAGE_EVENT = "newMessage";

//In memory message store
let messages: Message[] = [];

const emitter = new events.EventEmitter();
emitter.setMaxListeners(MAX_CHAT_USERS);

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
app.get("/messages", (req: Request, res: Response) => {
  res.json({ messages });
});

app.get("/messages/poll", (req: Request, res: Response) => {
  const handler = (newMessage: Message) => {
    clearTimeout(timer);
    res.json({message : newMessage});
  };

  emitter.once(NEW_MESSAGE_EVENT, handler);
  const timer = setTimeout(() => {
    emitter.removeListener(NEW_MESSAGE_EVENT, handler);
    res.status(204).end(null);
  }, 30000); // 30 seconds timeout
});

app.post("/message", (req: Request, res: Response) => {
  console.log("Received new message from client: ", req.body.message);
  const newMessage = new Message(req.body.message.text, req.headers.authorization as string);
  messages.push(newMessage);
  res.status(204).end(null);
  emitter.emit(NEW_MESSAGE_EVENT, newMessage);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
