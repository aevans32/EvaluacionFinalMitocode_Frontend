import { Component, Input } from '@angular/core';
import { Libro } from '../../models/libro.model';

@Component({
  selector: 'app-event-card',
  imports: [],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css'
})
export class EventCard {
  @Input({  required: true }) data!: Libro;

  onImageError() {
    this.data.imageUrl = 'images/generic-book-cover.jpg';
  }
}
