export interface BookingListItem {
  id: string;
  communityRoomId: string;
  roomName: string;
  bookedById: string;
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
