import { HttpClient, HttpHeaders } from '@angular/common/http';
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
        const token: string | null = this.getToken();

        // se non c'è il token
        if (token === null || token == "") {
            return false;
        }
        // verifica validità token
        this.http.post<boolean>(this.url + '/api/auth/verify', token).subscribe(
            response => {
                if(response === true) {
                    return true;
                } else {
                    console.log("Accesso non autorizzato, Token non valido o inesistente")
                    return false;
                }
            }
        );
        return true;
    }
}
