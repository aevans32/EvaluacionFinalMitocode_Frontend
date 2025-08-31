import { Component, inject } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { Footer } from '../shared/components/footer/footer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Auth } from '../shared/services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-login',
  imports: [Header, Footer, MatFormFieldModule, ReactiveFormsModule, MatButtonModule, RouterLink, MatInputModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  authService = inject(Auth);
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)])
  });
  router = inject(Router);

  // TODO: inject NotificationsService
  // notifications = inject(NotificationsService);

  login() {
    const email = this.loginForm.controls.email.value!;
    const password = this.loginForm.controls.password.value!;

    this.authService.login(email, password).subscribe((res) => {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('tokenExpiration', res.data.expiration);
      this.authService.decodeToken();
      // this.notifications.success('Login exitoso', 'Bienvenido');
      this.router.navigateByUrl('/');
    });
  }
}
