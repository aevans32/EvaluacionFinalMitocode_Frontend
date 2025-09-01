import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { Footer } from '../shared/components/footer/footer';
import { RouterLink } from "@angular/router";
import { Libro } from '../shared/models/libro';
import { LibrosService } from '../shared/services/libros-service';
import { EventCard } from '../shared/components/event-card/event-card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, Footer, EventCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  
  libros: WritableSignal<Libro[]> = signal([]);

  initialLibros: Libro[] = [];

  libroService = inject(LibrosService);

  ngOnInit(): void {
      this.libroService.getData().subscribe((response) => {
        this.initialLibros = response.libros;
        this.libros.set(this.initialLibros);
      });
      // TODO: agregar funcionalidad para filtrado por serach bar
  }

}
