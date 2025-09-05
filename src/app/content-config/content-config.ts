import { Component } from '@angular/core';
import { Header } from "../shared/components/header/header";
import { Footer } from "../shared/components/footer/footer";

@Component({
  selector: 'app-content-config',
  imports: [Header, Footer],
  templateUrl: './content-config.html',
  styleUrl: './content-config.css'
})
export class ContentConfig {

}
