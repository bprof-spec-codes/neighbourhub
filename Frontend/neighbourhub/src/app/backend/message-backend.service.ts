import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncomingMessageDto } from '../entities/dtos/incoming-message-dto.model';
import { SentMessageDto } from '../entities/dtos/sent-message-dto.model';
import { CreateMessageDto } from '../entities/dtos/create-message-dto.model';

@Injectable({
  providedIn: 'root'
})
export class MessageBackendService {
    private baseApiUrl = environment.apiUrl

    constructor(private http: HttpClient) { }

    public getIncoming(): Observable<IncomingMessageDto[]>{
        return this.http.get<IncomingMessageDto[]>(`${this.baseApiUrl}/Message/incoming`)
    }

    public getSent(): Observable<SentMessageDto[]>{
        return this.http.get<SentMessageDto[]>(`${this.baseApiUrl}/Message/sent`)
    }

    public sendMessage(dto: CreateMessageDto): Observable<void>{
        return this.http.post<void>(`${this.baseApiUrl}/Message`, dto)
    }

    public markAsRead(id: string): Observable<void>{
        return this.http.patch<void>(`${this.baseApiUrl}/Message/${id}/read`,{})
    }
}