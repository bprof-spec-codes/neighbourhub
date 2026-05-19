export class Vote {
    constructor(
        public id: string,
        public title: string,
        public deadline: Date,
        public yesCount: number,
        public noCount: number,
        public abstainCount: number,
        public hasVoted: boolean,
        public createdByUserId: string
    ) {}
}