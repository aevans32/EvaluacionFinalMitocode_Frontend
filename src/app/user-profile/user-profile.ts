import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";
import { Auth } from '../shared/services/auth';
import { LibroAlquiladoResponse } from '../shared/models/profile.model';
import { LibrosService } from '../shared/services/libros-service';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [Header, Footer, DatePipe, CurrencyPipe],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  // servicios
  private auth = inject(Auth);
  private librosSrv = inject(LibrosService);
  private notifications = inject(NotificationsService);

  // variables
  isLoggedIn = false;
  name = '';
  dni = '';
  profileImageUrl = '';

  private _alquilados: WritableSignal<LibroAlquiladoResponse[]> = signal([]);
  loading = false;
  errorMsg = '';

  private _pending = new Set<string>();
  isPending = (id: string) => this._pending.has(id);

  ngOnInit() {
    if (!this.auth.getIsLoggedIn()) this.auth.decodeToken();

    this.isLoggedIn = this.auth.getIsLoggedIn();
    if (!this.isLoggedIn) return;

    this.dni = this.auth.getDni() ?? '';
    this.name = this.auth.getName() ?? '';

    if (!this.dni) return;

    this.loading = true;
    this.librosSrv.getAlquiladosPorDni(this.dni).subscribe({
      next: items => this._alquilados.set(items ?? []),
      error: err => this.errorMsg = err?.message || 'No se pudo cargar los libros',
      complete: () => this.loading = false
    });
  }

  alquilados() {
    return this._alquilados();
  }

  retornar(item: LibroAlquiladoResponse) {
    const id = item.libroId; // ← aquí usamos libroId
    if (!id) {
      this.notifications.error('Retorno fallido', 'No se encontró el ID del libro.');
      return;
    }

    this._pending.add(id);

    this.librosSrv.checkin(id).subscribe({
      next: (res) => {
        if (res?.success) {
          // quitar el item devuelto por pedidoId (único en la lista del usuario)
          const lista = this._alquilados().filter(x => x.pedidoId !== item.pedidoId);
          this._alquilados.set(lista);

          this.notifications.success('Retorno exitoso', `Se registró el retorno de "${item.titulo}".`);
        } else {
          this.notifications.error('Retorno fallido', res?.errorMessage ?? 'No se pudo registrar el retorno.');
        }
      },
      error: (err) => {
        this.notifications.error('Error de servidor', err?.error?.errorMessage ?? 'Ocurrió un error al retornar el libro.');
      },
      complete: () => {
        this._pending.delete(id);
      }
    });
  }
}
