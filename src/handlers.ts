import type { Request, Response } from "express";
import events from "events";

import { Message } from "./entities.ts";

const MAX_CHAT_USERS: number = 100;

const NEW_MESSAGE_EVENT = "newMessage";

const emitter = new events.EventEmitter();
emitter.setMaxListeners(MAX_CHAT_USERS);

//In memory message store
let messages: Message[] = [];


interface SendMessageBody {
  message: Message;
}

export function getMessagesHandler(req: Request, res: Response) {
  console.log(`Get ${req.headers.authorization}`);
  res.json({ messages });
}

export function pollMessagesHandler(req: Request, res: Response) {
    console.log(`Poll ${req.headers.authorization}`);
    const handler = (newMessage: Message) => {
      clearTimeout(timer);
      res.json({message : newMessage});
    };
  
    emitter.once(NEW_MESSAGE_EVENT, handler);
    const timer = setTimeout(() => {
      emitter.removeListener(NEW_MESSAGE_EVENT, handler);
      res.status(204).end(null);
    }, 30000); // 30 seconds timeout
}

export function postMessageHandler(req: Request<{}, {}, SendMessageBody>, res: Response) {
  console.log("Received new message from client: ", req.body.message);
  const newMessage = new Message(req.body.message);
  messages.push(newMessage);
  res.status(204).end(null);
  emitter.emit(NEW_MESSAGE_EVENT, newMessage);
}

const Handlers = { getMessagesHandler, pollMessagesHandler, postMessageHandler };
export default Handlers;