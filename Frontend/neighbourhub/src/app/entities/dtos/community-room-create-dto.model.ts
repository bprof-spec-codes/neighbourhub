export class CommunityRoomCreateDto {
  constructor(
    public name: string,
    public description: string,
    public capacity: number
  ) {}
}
