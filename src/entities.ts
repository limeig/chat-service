class MessageSender {
  id: string;
  name: string;
  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}

export class Message {
  text: string;
  sender: MessageSender;
  constructor(message: Message) {
    this.text = message.text;
    this.sender = message.sender;
  }
}