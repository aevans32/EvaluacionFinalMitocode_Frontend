import { Component, inject } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { Footer } from '../shared/components/footer/footer';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Auth } from '../shared/services/auth';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { NotificationsService } from 'angular2-notifications';

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

  notifications = inject(NotificationsService);

  // login() {
  //   const email = this.loginForm.controls.email.value!;
  //   const password = this.loginForm.controls.password.value!;

  //   this.authService.login(email, password).subscribe({
  //     next: (res: any) => {
  //       // works whether unwrapData is on or off
  //       const token = res?.token ?? res?.data?.token;
  //       const expiration = res?.expiration ?? res?.data?.expiration;

  //       if (!token) {
  //         this.notifications.error('Login fallido', 'Respuesta inválida del servidor');
  //         return;
  //       }

  //       localStorage.setItem('token', token);
  //       localStorage.setItem('tokenExpiration', expiration ?? '');
  //       this.authService.decodeToken();
  //       this.notifications.success('Login exitoso', 'Bienvenido');
  //       this.router.navigateByUrl('/');
  //     },
  //     error: () => {
  //       this.notifications.error('Login fallido', 'Credenciales inválidas o error de red');
  //     }
  //   });
  // }

  login() {
    const email = this.loginForm.controls.email.value!;
    const password = this.loginForm.controls.password.value!;

    this.authService.login(email, password).subscribe({
      next: (res: any) => {
        // handle unwrapData on/off
        const token = res?.token ?? res?.data?.token;
        const expiration = res?.expiration ?? res?.data?.expiration;

        if (!token) {
          this.notifications.error('Login fallido', 'Respuesta inválida del servidor');
          return;
        }

        this.authService.setSessionFromToken(token, expiration);

        this.notifications.success('Login exitoso', 'Bienvenido');

        const isAdmin = this.authService.hasRole('Administrator');
        console.log(`isAdmin: ${isAdmin}`);
        // tiny delay so the toast is visible; optional
        setTimeout(() => this.router.navigateByUrl(isAdmin ? '/content-config' : '/'), 300);
      },
      error: () => {
        this.notifications.error('Login fallido', 'Credenciales inválidas o error de red');
      }
    });
  }

}