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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-content-config',
  imports: [Header, Footer, MatButtonModule, MatMenuModule],
  templateUrl: './content-config.html',
  styleUrl: './content-config.css'
})
export class ContentConfig {

  private librosService = inject(LibrosService);
  private dialog = inject(MatDialog);
  private snack = inject(MatSnackBar);

  libros = signal<Libro[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  initialLibros: Libro[] = [];
  hasFetched = signal(false);
  menuOpenForId = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchLibros();
  }

  fetchLibros() {
    this.loading.set(true);
    this.error.set(null);
    this.librosService.getData().subscribe({
      next: (rows) => {
        this.libros.set(rows ?? []);
        this.loading.set(false);
      },
      error: (e) => {
        console.error(e);
        this.error.set('No se pudo cargar la lista de libros.');
        this.loading.set(false);
      }
    });
  }

  onEdit(row: Libro) {
    const ref = this.dialog.open(LibroEditDialog, {
      width: '720px',
      data: row,                                  // Passes the current book
      // autoFocus: false
    });

    ref.afterClosed().subscribe(res => {
      if (res === 'refresh') {
        this.fetchLibros();
        this.snack.open('Libro actualizado', 'OK', { duration: 2500 });
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
