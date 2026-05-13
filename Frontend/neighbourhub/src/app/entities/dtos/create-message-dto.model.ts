export class CreateMessageDto {
    constructor(
        public receiverId: string,
        public subject: string,
        public body: string,
        public replyToId: string | null = null
    ) {}
}