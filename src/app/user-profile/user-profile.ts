import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";
import { Auth } from '../shared/services/auth';
import { LibroAlquiladoResponse } from '../shared/models/profile.model';
import { LibrosService } from '../shared/services/libros-service';
import { DatePipe, CurrencyPipe } from '@angular/common'; 

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

  // variables
  isLoggedIn = false;
  name = '';
  dni = '';
  profileImageUrl = '';

  private _alquilados: WritableSignal<LibroAlquiladoResponse[]> = signal([]);
  loading = false;
  errorMsg = '';

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
}
