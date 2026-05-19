import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vote } from '../entities/models/vote.model';
import { VoteAddDto } from '../entities/dtos/vote-add-dto.model';

@Injectable({
  providedIn: 'root'
})
export class VoteBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getVotes(): Observable<Vote[]> {
    return this.http.get<Vote[]>(`${this.baseApiUrl}/Vote`);
  }

  public deleteVoteById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseApiUrl}/Vote/${id}`);
  }

  
  public addVote(voteToAdd: VoteAddDto): Observable<Vote> {
    return this.http.post<Vote>(`${this.baseApiUrl}/Vote`, voteToAdd);
  }


  public castVote(voteId: string, option: number): Observable<void> {
    return this.http.post<void>(`${this.baseApiUrl}/Vote/${voteId}/entry`, { option });
  }
}