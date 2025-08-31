import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Footer } from '../shared/components/footer/footer';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

}
