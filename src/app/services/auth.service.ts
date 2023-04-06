import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly serverUrl: string = 'http://localhost:8080';
    private readonly frontUrl: string = 'http://localhost:4200';
    private readonly tokenHeader = 'token';
    private readonly authState = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient, private router: Router) { this.updateState(); }

    //-----------------------------------------------------------------//
    //-----Autenticazione-----//
    login(dati: { username: string, password: string }): Observable<boolean> {
        return this.http.post<{ token: string }>(`${this.serverUrl}/api/auth/signin`, dati)
            .pipe(map(response => {
                //storage del token
                this.setToken(response.token);
                this.updateState();
                return true;
            }),
                catchError(() => of(false))
            );
    }

    logout() {
        return this.http.post(`${this.serverUrl}/api/auth/logout`, {}).subscribe(
            () => {
                this.revokeToken();
                this.updateState();
                this.router.navigate(['/']);
            },
            (error) => console.log('Errore durante il logout')
        );
    }
    //-----Validators-----//

    //Regex
    public checkInput(input: string): boolean {
        const regex = /^[a-zA-Z0-9]{3,16}$/; //solo numeri e lettere | min-max 3-16 caratteri
        return regex.test(input);
    }


    //-----Shortcuts-----//
    isLogged = (): Observable<boolean> => this.authState;

    private updateState(): void {
        const isLogged = Boolean(this.getToken());
        this.authState.next(isLogged);
    }

    //-----Getters & Setters-----//
    getServerUrl = (): string => this.serverUrl;
    getFrontUrl = (): string => this.frontUrl;

    getToken = (): string | null => sessionStorage.getItem(this.tokenHeader);
    setToken = (token: string): void => sessionStorage.setItem(this.tokenHeader, token);
    revokeToken = (): void => sessionStorage.removeItem(this.tokenHeader);
}
