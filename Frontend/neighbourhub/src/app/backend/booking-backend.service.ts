import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookingListItem, BookingSlot } from '../entities/models/booking.model';
import { BookingCreateDto } from '../entities/dtos/booking-create-dto.model';

@Injectable({
  providedIn: 'root'
})
export class BookingBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  public getMy(): Observable<{ upcoming: BookingListItem[]; past: BookingListItem[] }> {
    return this.http.get<{ upcoming: BookingListItem[]; past: BookingListItem[] }>(`${this.baseApiUrl}/Booking/my`);
  }

  public getAll(): Observable<BookingListItem[]> {
    return this.http.get<BookingListItem[]>(`${this.baseApiUrl}/Booking`);
  }

  public create(dto: BookingCreateDto): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/Booking`, dto);
  }

  public cancel(id: string): Observable<void> {
    return this.http.put<void>(`${this.baseApiUrl}/Booking/${id}/cancel`, {});
  }

  public getAvailability(roomId: string, date: string): Observable<BookingSlot[]> {
    return this.http.get<BookingSlot[]>(`${this.baseApiUrl}/Booking/availability`, {
      params: { roomId, date }
    });
  }
}
