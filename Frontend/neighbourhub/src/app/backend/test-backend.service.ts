import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Test } from '../entities/models/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestBackendService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public getTests(): Observable<Test[]> {
    return this.http.get<Test[]>(`${this.apiUrl}/test`);
  }
}
