export interface EmailMessage {
  subject: string;
  text: string;
}

export interface EmailSenderLike {
  send(message: EmailMessage): Promise<void>;
}
