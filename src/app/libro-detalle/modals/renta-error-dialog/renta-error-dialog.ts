import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Libro } from '../../../shared/models/libro.model';

@Component({
  selector: 'app-renta-error-dialog',
  imports: [],
  templateUrl: './renta-error-dialog.html',
  styleUrl: './renta-error-dialog.css'
})
export class RentaErrorDialog {
  private dialogRef = inject(MatDialogRef<RentaErrorDialog>);
  data = inject<Libro>(MAT_DIALOG_DATA);
}
