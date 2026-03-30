import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterService } from '../../services/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
hidePass:boolean=true
  hidePass2:boolean=true
  registerForm: FormGroup

  constructor(private fb: FormBuilder, private registService:RegisterService, private router: Router) {
    this.registerForm = this.fb.group(
      {
        lastname: ['', [Validators.required, Validators.minLength(3)]],
        firstname: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        password2: ['', [Validators.required, Validators.minLength(8)]],
        apartmentNumber: ['', [Validators.required, Validators.pattern('^[0-9]+/[A-Za-z](,\\s?[0-9]+/[A-Za-z])*$')]], 
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
    

    const formValues = this.registerForm.value;
    const dto = {
    lastname: formValues.lastname,
    firstname: formValues.firstname,
    email: formValues.email,
    password: formValues.password,
    apartmentNumber: [formValues.apartmentNumber],
    phoneNumber: formValues.phoneNumber
  };

    this.registService.register(dto).subscribe({
    next: (response) => {
      console.log('Sikeres regisztráció:', response);
      alert('Sikeres regisztráció!');
      this.registerForm.reset();
      this.router.navigate(['/login']);
    },
    error: (err) => {
      console.error('Sikertelen regisztráció:', err);
      alert('Sikertelen regisztráció.');
    }
  });
  }
}
