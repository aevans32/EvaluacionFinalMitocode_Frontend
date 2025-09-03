import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './shared/services/auth';
import { Options, SimpleNotificationsModule } from 'angular2-notifications';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SimpleNotificationsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  authService = inject(Auth);
  notificationsOptions: Options = {
    position: ['top', 'right'],
    timeOut: 3000
  };
  protected readonly title = signal('mitocode_final');

}
