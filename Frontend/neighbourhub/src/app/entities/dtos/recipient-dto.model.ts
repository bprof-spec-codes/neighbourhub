export class RecipientDto {
    constructor(
        public id: string,
        public firstName: string,
        public lastName: string,
        public apartmentNumber: string[]
    ) {}
}