import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private serverUrl = this.authService.getServerUrl();

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    getUserId(): Observable<string> {
        return this.http.get<string>(this.serverUrl + '/api/user/id')
    }

    getUserEmail(): Observable<string> {
        return this.http.get<string>(this.serverUrl + '/api/user/email')
    }

    getUsername(): Observable<string> {
        return this.http.get<string>(this.serverUrl + '/api/user/username')
    }
}
