import { VoteOption } from "../enums/vote-option.model";

export class Vote {
    constructor(
        public id: string,
        public question: string,
        public deadline: Date,
        public yesCount: number,
        public noCount: number,
        public abstainCount: number,
        public userVote: VoteOption | null
    ) {}
}