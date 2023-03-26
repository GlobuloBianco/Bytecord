import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmojiService } from 'src/app/services/emoji.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

    emojiList: string[] = [''];
    isEmpty: boolean = false;
    serverUrl = this.authServ.getServerUrl();
    addInput = '';

    constructor(private authServ: AuthService, private http: HttpClient, private emojiService: EmojiService, private userService: UserService) { }

    ngOnInit(): void {
        //ritorna gli emoji salvati nel database
        this.getList();
    }

    //aggiunta emoji ----------------------
    addEmoji() {
        //test senza database
        let value = this.addInput;
        this.emojiList.push(value);
        this.aggiorna();
        this.addInput = '';
    }
    // se la lista è vuota isEmpty = true
    aggiorna = () => this.isEmpty = this.emojiList.length == 0;

    //aggiunta emoji dal database -------------------
    getList() {
        //prende l'id dell'utente e prende la sua lista emoji
        this.userService.getUserId().subscribe(id => {
            this.emojiService.getEmojiList(JSON.parse(id)).subscribe(
                (response: string[]) => {
                    response.length == 1 && response[0] === "" ? this.isEmpty = true : this.emojiList = response;
                },
                (error) => console.error(error)
            )
        })
    }

    //salvataggio sul clipboard-------------------------
    copyClipboard = (emoji: any) => {
        navigator.clipboard.writeText(emoji);
        console.log("copiato");
    }
}
