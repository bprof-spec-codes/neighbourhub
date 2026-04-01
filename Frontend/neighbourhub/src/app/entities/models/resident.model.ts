export class Resident {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public email: string,
    public phoneNumber: string,
    public profileImageUrl: string | null,
    public apartmentNumber: string[],
    public parkingSpace: string[],
    public storage: string[]
  ) {}
}
