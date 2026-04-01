import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { RegisterDto } from '../entities/dtos/register-dto';
import { Observable } from 'rxjs/internal/Observable';
import { LoginResult } from '../entities/dtos/login-result';
import { LoginDto } from '../entities/dtos/login-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthBackendService {
  private baseApiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<void> {
      return this.http.post<void>(`${this.baseApiUrl}/User/Register`, dto);
  }

  login(LoginDto: LoginDto): Observable<LoginResult> {
      return this.http.post<LoginResult>(`${this.baseApiUrl}/User/Login`, LoginDto);
  }
}
