import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions } from '@angular/material/dialog';
import { Libro } from '../../shared/models/libro.model';
import { LibrosService } from '../../shared/services/libros-service';
import { CreateLibroDto } from '../../shared/models/libro-create-dto.model';
import { MatInputModule } from "@angular/material/input";
import { MatDialogTitle, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-libro-edit-dialog',
  standalone: true,
  imports: [MatInputModule, MatDialogActions, MatDialogTitle, MatDialogContent, ReactiveFormsModule],
  templateUrl: './libro-edit-dialog.html',
  styleUrl: './libro-edit-dialog.css'
})
export class LibroEditDialog {

  private dialogRef = inject(MatDialogRef<LibroEditDialog>);
  data = inject<Libro>(MAT_DIALOG_DATA);
  private librosService = inject(LibrosService);

  isSaving = signal(false);
  errorMsg = signal<string | null>(null);
  imageFile: File | null = null;

  form = new FormGroup({
    titulo:             new FormControl(this.data.titulo, { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    autor:              new FormControl(this.data.autor,  { nonNullable: true, validators: [Validators.required, Validators.maxLength(200)] }),
    description:        new FormControl(this.data.description ?? '', { nonNullable: true, validators: [Validators.maxLength(1000)] }),
    extendedDescription:new FormControl(this.data.extendedDescription ?? '', { nonNullable: true, validators: [Validators.maxLength(4000)] }),
    unitPrice:          new FormControl(this.data.unitPrice ?? 0, { nonNullable: true, validators: [Validators.min(0)] }),
    genreId:            new FormControl(this.data.genreId ?? 0, { nonNullable: true, validators: [Validators.min(0)] }),
    imageUrl:           new FormControl(this.data.imageUrl ?? null),
    isbn:               new FormControl(this.data.isbn, { nonNullable: true, validators: [Validators.required, Validators.maxLength(50)] }),
    disponible:         new FormControl(this.data.disponible, { nonNullable: true })
  });

  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    this.imageFile = input.files && input.files.length ? input.files[0] : null;
  }

  // Accept button
  accept() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMsg.set(null);
    this.isSaving.set(true);

    const raw = this.form.getRawValue();
    const dto: CreateLibroDto = {
      titulo:               raw.titulo!,
      autor:                raw.autor!,
      description:          raw.description ?? '',
      extendedDescription:  raw.extendedDescription ?? '',
      unitPrice:            raw.unitPrice ?? 0,
      genreId:              raw.genreId ?? 0,
      image:                this.imageFile ?? undefined,
      isbn:                 raw.isbn!,
      disponible:           !!raw.disponible
    };

    const hasId = !!this.data?.id && this.data.id.trim().length > 0;

    const obs$ = hasId
      ? this.librosService.updateLibro(this.data.id, dto)
      : this.librosService.createNewLibro(dto);

    obs$.subscribe({
      next: () => {
        this.isSaving.set(false);
        this.dialogRef.close('refresh');
      },
      error: (e) => {
        console.error(e);
        this.isSaving.set(false);
        this.errorMsg.set('No se pudo guardar el libro.');
      }
    });
  }

  // Cancel button
  cancel() {
    this.dialogRef.close(null);
  }
}
