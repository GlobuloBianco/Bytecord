import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class EmojiService {

    serverUrl = this.authService.getServerUrl();

    constructor(private authService: AuthService, private http: HttpClient, private userService: UserService) { }

    //----- richieste http -----//
    getEmojiList(userId: number): Observable<string> {
        const url = `${this.serverUrl + "/api/user"}/${userId}/emoji`;
        return this.http.get(url, { responseType: 'text' });
    }

    updateEmojiList(emojiList: string): Observable<any> {
        return this.userService.getUserId().pipe(
            switchMap(userId => {
                const url = `${this.serverUrl}/api/user/${userId}/emoji`;
                const body = emojiList;
                return this.http.post(url, body, { responseType: 'text' });
            })
        );
    }

      //----- Varie -----//
    dataToArray = (e: string) => e.split(", ");
    commaFix = (e: string) => e.replace(/,/g, ", "); //impostare da virgola a virgola spazio

    toDatabaseFormat = (e: any) => {
        return e.replace(/[\[\]"']/g, '');// rimuove le parentesi quadre e le virgolette + commafix
    }

}
