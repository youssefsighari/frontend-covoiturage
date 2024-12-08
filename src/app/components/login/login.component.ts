import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtService } from 'src/app/service/jwt.service';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

loginForm!: FormGroup;

constructor(
  private service: JwtService,
  private fb: FormBuilder,
  private router: Router,
  private authService: AuthService
) {}

ngOnInit(): void {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]], 
    password: ['', Validators.required],
  });
}




submitForm() {
  if (this.loginForm.valid) {
    this.service.login(this.loginForm.value).subscribe(
      (response) => {
        console.log('Login successful:', response);
        localStorage.setItem('authToken', response.jwt);
        this.authService.login(); // Notifie que l'utilisateur est connecté
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Login failed:', error);
      }
    );
  } else {
    console.log('Form is not valid');
  }
}






}
