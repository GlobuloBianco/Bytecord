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

    emojiList: string = ''; // lista ricevuta
    displayList: string[] = ['']; // lista da display in html
    isEmpty: boolean = false; // boolean lista
    serverUrl = this.authServ.getServerUrl(); // backend
    addInput = ''; // inputfield

    constructor(private authServ: AuthService, private emojiService: EmojiService, private userService: UserService) { }

    ngOnInit(): void {
        this.getList(); //ritorna gli emoji salvati nel database
    }

    // --------------- aggiunta emoji dal database --------------- //
    getList() {
        //prende l'id dell'utente e prende la sua lista emoji
        this.userService.getUserId().subscribe(id => {
            this.emojiService.getEmojiList(parseInt(id)).subscribe(
                (response) => {
                    // check presenza
                    response.length == 0 || response == "" || response == " " ? this.isEmpty = true : this.emojiList = response;
                    console.log("risposta get: " + this.emojiList) //---------------- da rimuovere //---------------- da rimuovere //---------------- da rimuovere
                    this.displayList  = this.emojiList.split(", ");
                    console.log("convertito in array il get:")
                    console.log(this.displayList) //---------------- da rimuovere //---------------- da rimuovere //---------------- da rimuovere
                }
            )
        })
    }

    // --------------- aggiunta emoji --------------- //
    addEmoji() {
        let emojiUrl = this.addInput.trim(); // per eventuali spazi extra
        this.addInput = '';

        // check length dell url
        if (emojiUrl.length >= 150) return alert("l'url è troppo grande! riprova un altro.");

        // rimozione di url discord invalidi
        if (!emojiUrl.startsWith("https://cdn.discordapp.com/emojis/")) alert('Discord emoji invalido o corrotto :C prova un altro');

        let result = [this.emojiList, emojiUrl].join(", ");
        result.trim();  //double check :)
        result.startsWith(",") ? (result = result.slice(1), result.trim) : null
        console.log("Trimmato: " + result) //---------------- da rimuovere //---------------- da rimuovere //---------------- da rimuovere

        // Invia la richiesta POST al backend per aggiornare la lista dell'utente
        this.userService.getUserId().subscribe(userId => {
            console.log("Id utente: " + userId) //---------------- da rimuovere //---------------- da rimuovere //---------------- da rimuovere
            this.emojiService.updateEmojiList(parseInt(userId), result).subscribe(
                (response => { console.log(response) }))
        });

        this.getList();
        this.aggiorna(); //reset input field + check lista vuota
    }

    aggiorna = () => (this.isEmpty = this.emojiList.length == 0); // Vuoto = TRUE | Pieno = FALSE

    //salvataggio sul clipboard-------------------------
    copyClipboard = (emoji: string) => {
        navigator.clipboard.writeText(emoji);
        console.log("copiato");
    }

}
