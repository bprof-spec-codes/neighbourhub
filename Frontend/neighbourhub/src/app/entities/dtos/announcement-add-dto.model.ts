import { AnnouncementCategory } from "../enums/announcement-category.model";

export class AnnouncementAddDto {
    constructor(
        public title: string,
        public content: string,
        public category: AnnouncementCategory
    ) {}
}