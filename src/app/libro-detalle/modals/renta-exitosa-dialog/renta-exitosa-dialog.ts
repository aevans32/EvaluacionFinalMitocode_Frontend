import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-renta-exitosa-dialog',
  imports: [],
  templateUrl: './renta-exitosa-dialog.html',
  styleUrl: './renta-exitosa-dialog.css'
})
export class RentaExitosaDialog {
  private ref = inject(MatDialogRef<RentaExitosaDialog>);

  cerrar() {
    this.ref.close(true);
  }
}
