import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrosService } from '../shared/services/libros-service';
import { MatDialog } from '@angular/material/dialog';
import { Libro } from '../shared/models/libro.model';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";
import { ConfirmarRentaDialog } from './modals/confirmar-renta-dialog/confirmar-renta-dialog';
import { RentaExitosaDialog } from './modals/renta-exitosa-dialog/renta-exitosa-dialog';
import { RentaErrorDialog } from './modals/renta-error-dialog/renta-error-dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-libro-detalle',
  imports: [Header, Footer],
  templateUrl: './libro-detalle.html',
  styleUrl: './libro-detalle.css'
})
export class LibroDetalle implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private service = inject(LibrosService);
  private dialog = inject(MatDialog);

  libro = signal<Libro | null>(null);
  cargando = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.service.getById(id).subscribe({
      next: (res: Libro) => {
        // console.log('Respuesta getById:', res);        // log de depuracion
        this.libro.set(res);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  volver() {
    this.router.navigateByUrl('/');
  }

  rentar() {
    const l = this.libro();        // ← lee el valor del signal
    if (!l) return;                // si aún no cargó, sale

    this.dialog.open(ConfirmarRentaDialog, {
      data: { titulo: l.titulo },  // ← usa l.titulo
      disableClose: true
    })
    .afterClosed()
    .subscribe((ok: boolean) => {
      if (!ok) return;

      this.service.checkout(l.id)  // ← usa l.id
        .subscribe({
          next: (res) => {
            if (res && (res as any).success !== false) {
              this.dialog.open(RentaExitosaDialog, { disableClose: true })
                .afterClosed().subscribe(() => this.volver());
            } else {
              this.dialog.open(RentaErrorDialog, {
                data: { mensaje: (res as any)?.errorMessage ?? 'No se pudo completar la renta.' }
              });
            }
          },
          error: (err) => {
            this.dialog.open(RentaErrorDialog, {
              data: { mensaje: err?.error?.errorMessage ?? 'Ocurrió un error al rentar el libro.' }
            });
          }
        });
    });
  }

}
