export interface BookingListItem {
  id: string;
  roomName: string;
  bookedByName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  numberOfPeople: number;
}

export interface BookingSlot {
  startTime: string;
  endTime: string;
}
