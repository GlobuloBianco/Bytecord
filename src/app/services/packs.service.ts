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

        getAllByType(type: String): Observable<Object> {
            const url = `${this.serverUrl}/api/packs/` + type;
            return this.http.get(url, { responseType: 'json' });
        }

        requestPack(pack: { nome: String, lista: string }): Observable<Object> {
            const url = `${this.serverUrl}/api/packs/add`;
            return this.http.post(url, pack);
        }

        deletePack(packName: string): Observable<Object> {
            const url = `${this.serverUrl}/api/packs/delete`;
            return this.http.post(url, packName, { responseType: 'text' });
        }

        reviewPack(packName: string, decision: string): Observable<Object> {
            const url = `${this.serverUrl}/api/packs/update/`+ decision;
            return this.http.post(url, packName, { responseType: 'text' });
        }
}
