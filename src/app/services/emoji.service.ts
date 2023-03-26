import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EmojiService {

    serverUrl = this.authService.getServerUrl() + "/api/user";

    constructor(private authService: AuthService, private http: HttpClient) { }

    getEmojiList(userId: number): Observable<string[]> {
        const url = `${this.serverUrl}/${userId}/emoji`;

        return this.http.get<string[]>(url);
    }
}
