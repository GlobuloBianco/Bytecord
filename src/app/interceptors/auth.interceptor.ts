import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService, private router: Router) { }

    private token: string | null = null;

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // aggiunta del token all'header
        this.token = this.authService.getToken();

        if (this.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${this.token}`
                }
            });
        }
        return next.handle(request).pipe(
            catchError(error => {
                this.removeToken(); // Rimuove il token scaduto "dall'interceptor"
                this.router.navigate(['/404/expired']);
                return throwError(() => new Error('Sessione Scaduta.'));
            })
        );
    }

    removeToken = (): null => this.token = null;
}
