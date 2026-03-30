import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { RegisterDto } from '../entities/dtos/register-dto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
private apiBaseUrl = environment.apiUrl + '/User/Register'

  constructor(private http: HttpClient) {}

  register(dto: RegisterDto): Observable<any> {
      return this.http.post(this.apiBaseUrl, dto);
    }
}
