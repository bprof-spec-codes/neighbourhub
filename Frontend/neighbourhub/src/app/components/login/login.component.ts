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
        this.router.navigate(['/homepage']); 
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message ?? err?.message ?? 'Hibás email vagy jelszó.';
      }
    });
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }
}
