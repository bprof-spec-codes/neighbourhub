export class VoteAddDto {
    constructor(
        public question: string,
        public deadline: Date
    ) {}
}