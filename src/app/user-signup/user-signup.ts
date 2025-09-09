import { Component, inject } from '@angular/core';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";
import { Auth } from '../shared/services/auth';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { RegisterRequestBody } from '../shared/models/auth.model';
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-signup',
  standalone: true,
  imports: [Header, Footer, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './user-signup.html',
  styleUrl: './user-signup.css'
})
export class UserSignup {

  private fb = inject(FormBuilder);
  private authService = inject(Auth);
  private notifications = inject(NotificationsService);
  private router = inject(Router);

  // Tipado y validadores
  resgisterForm = this.fb.group({
    firstName:        this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
    lastName:         this.fb.nonNullable.control('', [Validators.required, Validators.maxLength(100)]),
    age:              this.fb.nonNullable.control<number | null>(null, [Validators.required, Validators.min(18), Validators.max(120)]),
    email:            this.fb.nonNullable.control('', [Validators.required, Validators.email, Validators.maxLength(150)]),
    documentNumber:   this.fb.nonNullable.control('', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]),
    documentType:     this.fb.nonNullable.control<number | null>(null, [Validators.required]), // e.g. 1 = DNI
    password:         this.fb.nonNullable.control('', [Validators.required, Validators.minLength(6)]),
    confirmPassword:  this.fb.nonNullable.control('', [Validators.required])
  }, { validators: [ passwordMatchValidator ]}); // 👈 ver función abajo

  register() {
    if (this.resgisterForm.invalid) {
      this.resgisterForm.markAllAsTouched();
      return;
    }

    const f = this.resgisterForm.getRawValue(); // ya pasó validación

    const body: RegisterRequestBody = {
      documentNumber: String(f.documentNumber),
      firstName: f.firstName,
      lastName: f.lastName,
      password: f.password,
      email: f.email,
      // coerción segura: ya no serán null por validación
      documentType: Number(f.documentType),
      age: Number(f.age),
      confirmPassword: f.confirmPassword
    };

    this.authService.register(body).subscribe({
      next: (resp) => {
        this.notifications.success('Registro', 'Usuario creado correctamente');
        // console.log('Registro exitoso', resp);    // depuracion
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        // Mostrar errores de ModelState de .NET
        const errors = err?.error?.errors as Record<string, string[]> | undefined;
        if (errors) {
          const mensajes = Object.entries(errors).flatMap(([k, v]) => v.map(m => `${k}: ${m}`));
          mensajes.forEach(m => this.notifications.error('Validación', m));
          console.error('Validación:', mensajes);
        } else {
          this.notifications.error('Registro', 'Ocurrió un error al registrar el usuario.');
          console.error('Error en registro', err);
        }
      }
    });
  }
}

// Validador de confirmación de contraseña
import { AbstractControl, ValidationErrors } from '@angular/forms';
function passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const pass = group.get('password')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return pass && confirm && pass !== confirm ? { passwordMismatch: true } : null;
}
