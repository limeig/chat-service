import express from 'express';
import type { Request, Response } from 'express';

import cors from 'cors';
import events from 'events';

const app = express();
const PORT = process.env.PORT || 5000;

class Message {
    body: string;
    constructor(body: string) {
        this.body = body;
    }
}

//In memory message store
let messages: Message[] = [];
let newMessage: Message | null = null;

const emitter = new events.EventEmitter();

// Middleware
app.use(cors());
app.use(express.json());

//Routes
app.get('/get-messages', (req: Request, res: Response) => {
    console.log('Client subscribed for new messages');
    emitter.once('newMessage', () => {
        console.log('Sending new message to client, ', newMessage?.body);
        res.json({ message: newMessage?.body });
    });
}); 

app.post('/send-message', (req: Request, res: Response) => {
    console.log('Received new message from client: ', req.body.message);
    newMessage = new Message(req.body.message);
    emitter.emit('newMessage');
    messages.push(newMessage); 
    res.status(201).end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});