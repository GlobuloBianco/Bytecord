import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private serverUrl = this.authService.getServerUrl();

    constructor(private http: HttpClient, private authService: AuthService) { }

    getUserId(): Observable<string> {
        return this.http.get<string>(this.serverUrl + '/api/user/id');
    }

    getUserEmail(): Observable<string> {
        return this.http.get(this.serverUrl + '/api/user/email', { responseType: 'text' });
    }

    getUsername(): Observable<string> {
        return this.http.get(this.serverUrl + '/api/user/username', { responseType: 'text' });
    }

    getAuthorization(): Observable<string> {
        return this.http.get(this.serverUrl + '/api/user/role', { responseType: 'text' });
    }
}
