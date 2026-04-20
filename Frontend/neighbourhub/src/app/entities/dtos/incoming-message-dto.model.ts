export class IncomingMessageDto {
    constructor(
        public id: string,
        public senderId: string,
        public senderName: string,
        public subject: string,
        public body: string,
        public sentAt: Date,
        public isRead: boolean,
        public replyToId: string | null
    ) {}
}