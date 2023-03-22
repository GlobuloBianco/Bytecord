import { HttpClient, HttpHeaders, HttpInterceptor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthInterceptor } from '../interceptors/auth.interceptor';


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    //url Backend
    private readonly url: string = 'http://localhost:8080';
    public logged: boolean = false;

    constructor(private http: HttpClient, private router: Router) { }

    //-----------------------------------------------------------------//

    getServerUrl(): string {
        return  this.url;
    }

    login(dati: { username: string, password: string }) {
        return this.http.post<any>(this.url + '/api/auth/signin', dati);
    }

    logout() {
    // effettua la richiesta di logout al server
    this.http.post(this.url + '/api/auth/logout', {}).subscribe(
        () => {
            console.log('Logout effettuato con successo');
            this.removeToken();
            this.router.navigate(['/']);
        },
        (error) => {
            console.log('Errore durante il logout:', error);
        }
    );
}

    removeToken():void {
        sessionStorage.removeItem('token');
    }

    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    isLogged(): Observable<boolean> {
        const token = this.getToken();
        if (!token) {
            return of(false);
        }

        return this.http.post<boolean>(`${this.url}/api/auth/verify`, { token }).pipe(
            catchError(() => of(false))
        );
    }
}
