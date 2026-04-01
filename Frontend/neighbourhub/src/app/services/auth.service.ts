import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { JwtPayload } from '../entities/models/jwt-payload';
import { RegisterDto } from '../entities/dtos/register-dto';
import { AuthBackendService } from '../backend/auth-backend.service';
import { LoginDto } from '../entities/dtos/login-dto';
import { Router } from '@angular/router';
import { LoginResult } from '../entities/dtos/login-result';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = environment.storageKey;

  constructor(private authBackendService: AuthBackendService, private router: Router) {}

  public login(dto: LoginDto): Observable<LoginResult> {
    return this.authBackendService.login(dto);
  }

  saveToken(token: string) {
    localStorage.setItem(this.storageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.storageKey);
  }

   logout() {
     localStorage.removeItem(this.storageKey);
     this.router.navigate(['/login']);
   }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const payload = this.decodePayload(token);
    if (!payload) return false;
    if (payload.exp) {
      const now = Math.floor(Date.now() / 1000);
      return now < payload.exp;
    }
    return true;
  }

  decodePayload(token: string): any | null {
    try {
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
  
  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodePayload(token);
    if (!payload) return null;

    const id = payload[AuthService.NAME_ID_CLAIM];
    return typeof id === 'string' && id.trim() !== '' ? id : null;
  }

  public static readonly NAME_ID_CLAIM =
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier';

  private getPayload(token: string): JwtPayload | null {
    try {
      const base64url = token.split('.')[1] ?? '';
      const json = this.base64UrlDecode(base64url);
      return JSON.parse(json) as JwtPayload;
    } catch {
      return null;
    }
  }

  private base64UrlDecode(input: string): string {
    const base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad =
      base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    const s = atob(base64 + pad);
    return decodeURIComponent(
      s
        .split('')
        .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
        .join(''),
    );
  }

  getRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];

    const payload = this.getPayload(token);
    if (!payload) return [];

    // minden kulcsot végignézünk, és ami role, azt összegyűjtjük
    const roles: string[] = [];

    for (const key in payload) {
      if (key.endsWith('/role')) {
        const value = (payload as any)[key];
        if (Array.isArray(value)) {
          roles.push(...value);
        } else {
          roles.push(value);
        }
      }
    }
    return roles;
  }

  isAdmin(): boolean {
    return this.getRoles().includes('Admin');
  }
  /*regisztráció*/
  register(dto: RegisterDto): Observable<any> {
    
    return this.authBackendService.register(dto);
  }
}
