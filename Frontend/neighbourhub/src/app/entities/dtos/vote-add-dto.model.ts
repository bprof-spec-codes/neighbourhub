export class VoteAddDto {
    constructor(
        public title: string,
        public deadline: Date
    ) {}
}