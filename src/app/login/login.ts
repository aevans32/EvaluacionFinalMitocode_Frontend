import { Component } from '@angular/core';
import { Header } from '../shared/components/header/header';
import { Footer } from '../shared/components/footer/footer';

@Component({
  selector: 'app-login',
  imports: [ Header, Footer],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

}
