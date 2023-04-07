import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PacksService {
    serverUrl = this.authService.getServerUrl();
    constructor(private http: HttpClient, private authService: AuthService) { }

        //----- Richieste http -----//
        getAllPacks(): Observable<Object> {
            const url = `${this.serverUrl}/api/packs/`;
            return this.http.get(url, { responseType: 'json' });
        }
}
