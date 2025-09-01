import { Component, inject, OnInit } from '@angular/core';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";
import { Auth } from '../shared/services/auth';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [Header, Footer],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css'
})
export class UserProfile implements OnInit {
  private auth = inject(Auth);
  isLoggedIn = false;
  dni = '';
  // private clientes = inject(Clientes)

  ngOnInit() {
    if (!this.auth.getIsLoggedIn()) {
      this.auth.decodeToken();
    }
    
    this.isLoggedIn = this.auth.getIsLoggedIn();
    if (this.isLoggedIn) {
      this.dni = this.auth.getDni();
    } 
  }
}
