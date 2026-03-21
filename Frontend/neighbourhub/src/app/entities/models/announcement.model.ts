import { AnnouncementCategory } from "../enums/announcement-category.model";

export class Announcement {
    constructor(
        public id: number,
        public title: string,
        public content: string,
        public category: AnnouncementCategory,
        public createdDate: Date
    ) {}
}