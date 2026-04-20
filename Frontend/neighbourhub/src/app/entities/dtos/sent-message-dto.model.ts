export class SentMessageDto {
    constructor(
        public id: string,
        public receiverId: string,
        public receiverName: string,
        public subject: string,
        public body: string,
        public sentAt: Date,
        public isRead: boolean,
        public replyToId: string | null
    ) {}
}