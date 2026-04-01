import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginDto } from '../../entities/dtos/login-dto';
import { LoginResult } from '../../entities/dtos/login-result';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@UntilDestroy()
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;
  hidePass:boolean=true
  hidePass2:boolean=true

  constructor(private auth: AuthService, private router: Router) {}

  onLogin() {
    this.error = '';
    this.loading = true;

    const dto: LoginDto = {
      email: this.email,
      password: this.password
    };

    this.auth.login(dto).pipe(untilDestroyed(this)).subscribe({
      next: (res: LoginResult) => {
      const token = res?.token;
        if (!token) {
           this.error = 'Invalid response from server.';
           this.loading = false;
          return;
        }
        this.auth.saveToken(token);
        this.router.navigate(['/auth/login']); 
    },
    error: (err) => {
      console.error('Registration failed:', err);
      this.error = err.error?.message || 'Registration failed. Please try again.';
    }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
  passwordVisibility(field: 'password' | 'password2'): void {
    if (field === 'password') {
      this.hidePass = !this.hidePass;
    } 
    else
    {
        this.hidePass2 = !this.hidePass2;
    }
  }
}
