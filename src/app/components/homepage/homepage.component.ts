import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

    list: any[] = [""];
    serverUrl = this.authServ.getServerUrl();
    addInput = '';

    constructor(private authServ: AuthService, private http: HttpClient) { }

    ngOnInit(): void {
        //ritorna gli emoji salvati nel database
        this.emojiList();
    }

    //aggiunta emoji ----------------------
    addEmoji() {
        //test senza database
        let value = this.addInput;
        this.list.push(value);
        this.addInput = '';
    }

    //aggiunta emoji dal database -------------------
    emojiList() {

        this.http.get(this.serverUrl + '/api/user/emoji').subscribe((data: any) => {
            this.list = data;
            //testing
            console.log(data)
        });
    }

    //salvataggio sul clipboard-------------------------
    copyClipboard = (emoji: any) => navigator.clipboard.writeText(emoji);
}
