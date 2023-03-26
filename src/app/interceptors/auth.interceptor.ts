import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

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
                //se l'errore deriva dalla scadenza token
                if (error instanceof HttpErrorResponse && error.status === 403 && error.message.includes('/api/user/emoji')) {
                    alert('Sessione Scaduta');
                    this.removeToken(); // Rimuove il token scaduto "dall'interceptor"
                    this.authService.logout();
                }
                return throwError(() => new Error('Errore nella richiesta.'));
            })
        );
    }

    removeToken = (): null => this.token = null;
}
