import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";
import { Libro } from '../shared/models/libro.model';
import { LibrosService } from '../shared/services/libros-service';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { LibroEditDialog } from './libro-edit-dialog/libro-edit-dialog';

@Component({
  selector: 'app-content-config',
  imports: [Header, Footer, MatButtonModule, MatMenuModule],
  templateUrl: './content-config.html',
  styleUrl: './content-config.css'
})
export class ContentConfig {

  private libroService = inject(LibrosService);

  error = signal<string | null>(null);

  libros: WritableSignal<Libro[]> = signal([]);
  initialLibros: Libro[] = [];

  hasFetched = signal(false);

  loading = computed(() => !this.hasFetched() && this.error() === null);

  menuOpenForId = signal<string | null>(null);


  // For modal
  private dialog = inject(MatDialog);

  openEditDialog(row: Libro) {
    const ref = this.dialog.open(LibroEditDialog, {
      width: '680px',
      data: row,                                  // Passes the current book
      autoFocus: false
    });

    ref.afterClosed().subscribe((updated: Libro | null) => {
      if (!updated) return;       // Cancelado

      // Actualizar local y luego llamar al backend
      const next = this.libros().map(b => (b.id === updated.id ? updated : b));
      this.libros.set(next);
      console.log('Libro actualizado:', updated);
      // TODO: call this.libroService.updateLibro(updated).subscribe(...)
    });
  }


  ngOnInit(): void {
    this.libroService.getData().subscribe({
      next: (items: Libro[]) => {
        this.initialLibros = items;
        this.libros.set(items);
        this.hasFetched.set(true);
      },
      error: (err) => {
        console.error(err);
        this.error.set('No se pudo cargar la lista de libros.');
        this.hasFetched.set(true);
      }
    });
  }

  private makeKey(b: Libro): string {
    return (b.isbn ?? '').trim();
  }

  countsByKey = computed(() => {
    const map = new Map<string, number>();
    for (const b of this.libros()) {
      const k = this.makeKey(b);
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return map;
  });

  getCountFor(b: Libro): number {
    return this.countsByKey().get(this.makeKey(b)) ?? 0;
  }

}
