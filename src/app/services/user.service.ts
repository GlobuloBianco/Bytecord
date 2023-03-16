import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private url = '/api/user';

    constructor(private http: HttpClient, private router: Router) { }

    getUserData(): Observable<any> {
        return this.http.get<any>(this.url);
    }

}
