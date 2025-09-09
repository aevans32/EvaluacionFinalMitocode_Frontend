import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth } from '../../shared/services/auth';
import { MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from "@angular/material/input";



@Component({
  selector: 'app-forgot-password-dialog',
  imports: [MatDialogTitle, ReactiveFormsModule, MatFormField, MatInputModule],
  templateUrl: './forgot-password-dialog.html',
  styleUrl: './forgot-password-dialog.css'
})
export class ForgotPasswordDialog {

  private fb = inject(FormBuilder);
  private auth = inject(Auth);
  private ref = inject(MatDialogRef<ForgotPasswordDialog>);

  loading = false;
  sent = false;
  errorMsg = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  close() { this.ref.close(false); }

  onSubmit() {
    if (this.form.invalid) return;

    this.loading = true;
    this.errorMsg = '';
    const email = this.form.value.email as string;

    this.auth.sendTokenToResetPassword(email)
      .subscribe({
        next: (res) => {
          this.loading = false;
          this.sent = true;
          if (!res.success) {
            this.errorMsg = res.errorMessage ?? 'No se pudo enviar el correo.'
          }
          else {
            // Cerrar automaticamente
            setTimeout(() => this.ref.close(true), 1500);
          }
        },
        error: () => {
          this.loading = false;
          this.errorMsg = 'Ocurrio un error. Intenta nuevamente.';
        }
      });
  }

}
