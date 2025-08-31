import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

}
