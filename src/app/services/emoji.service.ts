import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class EmojiService {

    serverUrl = this.authService.getServerUrl();

    constructor(private authService: AuthService, private http: HttpClient) { }

    //----- CRUD -----//
    getEmojiList(userId: number): Observable<string> {
        const url = `${this.serverUrl  + "/api/user"}/${userId}/emoji`;
        return this.http.get(url, { responseType: 'text' });
    }

    updateEmojiList(userId: number, emojiList: string): Observable<any> {
        const url = `${this.serverUrl}/api/user/${userId}/emoji`;
        const body = emojiList;
        return this.http.post(url, body, { responseType: 'text' });
    }
}
