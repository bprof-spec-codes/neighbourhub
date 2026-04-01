import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { LoginResult } from '../../entities/dtos/login-result';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
@UntilDestroy()
export class RegisterComponent {
  hidePass:boolean=true
  hidePass2:boolean=true
  registerForm: FormGroup
  serverErrorMessage: string = ''
  constructor(private fb: FormBuilder, private auth:AuthService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        firstname: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[0-9])(?=.*[A-Z]).*$/)]],
        password2: ['', [Validators.required]],
        apartmentNumber: ['', [Validators.required]], 
        phoneNumber: ['', [Validators.required, Validators.pattern('^(\\+36|06|36)?[\\s\\-]?(20|30|31|70|1|[2-9][0-9])[\\s\\-]?[0-9]{3}[\\s\\-]?[0-9]{3,4}$')]],
      }
    )
  }
  PasswordMatch():boolean{
    const pw=this.registerForm.get('password')?.value;
    const pw2=this.registerForm.get('password2')?.value;
    return pw&&pw2&&pw!==pw2
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
  canSubmit(): boolean {
    return this.registerForm.valid && !this.PasswordMatch();
  }
  onSubmit(){
    this.serverErrorMessage = '';

    const formValues = this.registerForm.value;
    const dto = {
      lastname: formValues.lastname,
      firstname: formValues.firstname,
      email: formValues.email,
      password: formValues.password,
      apartmentNumber: [formValues.apartmentNumber],
      phoneNumber: formValues.phoneNumber
  };

    this.auth.register(dto).pipe(untilDestroyed(this)).subscribe({ 
    next: () => {
        this.router.navigate(['/auth/login']); 
    },
    error: (err) => {
      console.error('Registration failed:', err);
      this.serverErrorMessage = err.error?.message || 'Registration failed. Please try again.';
    }
  });
  }
}
