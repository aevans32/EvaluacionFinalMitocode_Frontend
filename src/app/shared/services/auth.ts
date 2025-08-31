import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { LoginApiResponse } from "../models/auth.model";

@Injectable({
    providedIn: 'root'
})
export class Auth {
    private swagger = 'https://localhost:7294/swagger/index.html';
    private baseUrl = 'http://localhost:7294/api/';
    private http = inject(HttpClient);

    private tokenExpiration = signal(new Date());

    private role = signal('');
    private email = signal('');
    private name = signal('');

    private isLoggedIn = signal(false);

    private router = inject(Router);
    // notifications = inject(NotificationsService);

    getRole() { return this.role(); }
    getEmail() { return this.email(); }
    getName() { return this.name(); }
    getIsLoggedIn() { return this.isLoggedIn(); }
    getTokenExpiration() { return this.tokenExpiration(); }

    login(email: string, password: string) {
        return this.http.post<LoginApiResponse>(this.baseUrl + 'Clientes/Login', {
            username: email, password
        });
    }
    

}