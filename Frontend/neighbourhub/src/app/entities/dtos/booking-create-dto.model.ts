export class BookingCreateDto {
  constructor(
    public communityRoomId: string,
    public bookingDate: string,
    public startTime: string,
    public endTime: string,
    public numberOfPeople: number
  ) {}
}
