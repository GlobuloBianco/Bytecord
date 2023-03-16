import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    //url Backend
    private readonly url: string = 'http://localhost:8080';

    constructor(private http: HttpClient, private router: Router) { }


    login(dati: { username: string, password: string }) {
        return this.http.post<any>(this.url + '/api/auth/signin', dati);
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/']);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLogged(): boolean {
        const token = this.getToken();
        // se non è presente
        if (!token) {
            return false;
        }
        return true

    }

}
