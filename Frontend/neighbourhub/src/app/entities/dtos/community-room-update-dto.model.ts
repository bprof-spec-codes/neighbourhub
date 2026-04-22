export class CommunityRoomUpdateDto {
  constructor(
    public name: string,
    public description: string,
    public capacity: number,
    public isActive: boolean
  ) {}
}
