import { Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { Libro } from '../../../shared/models/libro.model';
import { LibrosService } from '../../../shared/services/libros-service';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-confirmar-renta-dialog',
  imports: [MatDialogTitle, MatDialogContent, MatButton],
  templateUrl: './confirmar-renta-dialog.html',
  styleUrl: './confirmar-renta-dialog.css'
})
export class ConfirmarRentaDialog {

  private dialogRef = inject(MatDialogRef<ConfirmarRentaDialog>)
  data = inject<Libro>(MAT_DIALOG_DATA);
  private librosService = inject(LibrosService)
  
  close(v: boolean) {
    this.dialogRef.close(v);
  }

  
}
