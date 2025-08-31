import { HttpClient } from "@angular/common/http";
import { Injectable, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode } from 'jwt-decode';
import { ChangePasswordRequestBody, LoginApiResponse, RegisterRequestBody } from "../models/auth.model";

@Injectable({
    providedIn: 'root'
})
export class Auth {

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

    register(body: RegisterRequestBody) {
        return this.http.post(this.baseUrl + 'Clientes/Register', body);
    }
    
    sendTokenToResetPassword(email: string) {
        return this.http.post(this.baseUrl + 'Clientes/RequestTokenToResetPassword', { email });
    }

    resetPassword(body: ChangePasswordRequestBody) {
        return this.http.post(this.baseUrl + 'Clientes/ChangePassword', body)
    }

    decodeToken(){
        const token = localStorage.getItem('token');
        const tokenExpiration = localStorage.getItem('tokenExpiration');

        if (!token || !tokenExpiration) return;

        this.tokenExpiration.set(new Date(tokenExpiration));

        const jwtDecoded = jwtDecode<any>(token);

        this.role.set(
            jwtDecoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
        );
        this.email.set(
            jwtDecoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
        );
        this.name.set(
            jwtDecoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
        );

        this.isLoggedIn.set(true);
    }

    logout(tokenExpired = false){
        localStorage.clear();
        this.name.set('');
        this.email.set('');
        this.role.set('');
        this.tokenExpiration.set(new Date());
        this.isLoggedIn.set(false);

        if (tokenExpired) {
            // TODO: activar notificaciones
            // this.notifications.warn('Token Expirado. Por favor inicia sesión');
            this.router.navigateByUrl('/login');
        }
        else {
            // this.notifications.success('Logout exitoso', 'Vuelve pronto');
            this.router.navigateByUrl('/');
        }

    }
}