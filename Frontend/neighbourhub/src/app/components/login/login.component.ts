import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
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

    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res?.token ?? res?.Token;
        if (!token) {
          this.error = 'Hibás válasz a szervertől.';
          this.loading = false;
          return;
        }
        this.auth.saveToken(token);
        this.router.navigate(['/dashboard']); 
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? err?.message ?? 'Invalid email address or password.';
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
