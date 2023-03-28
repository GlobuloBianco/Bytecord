import { Component, OnInit, Renderer2 } from '@angular/core';
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
    modifyFlag: boolean = false; //modifica

    constructor(private authServ: AuthService, private emojiService: EmojiService, private userService: UserService, private renderer: Renderer2) { }

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
                    response.length == 0 || response == "" || response == " " ? this.isEmpty = true : (this.emojiList = response.trim(), this.aggiorna());
                    this.displayList = this.emojiList.split(", ");
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
        if (!emojiUrl.startsWith("https://cdn.discordapp.com/emojis/")) return alert('Discord emoji invalido o corrotto :C prova un altro');

        let result = [this.emojiList, emojiUrl].join(", ");
        result.trim();  //double check :)
        result.startsWith(",") ? (result = result.slice(1), result.trim) : null

        // Invia la richiesta POST al backend per aggiornare la lista dell'utente
        this.userService.getUserId().subscribe(userId => {
            this.emojiService.updateEmojiList(parseInt(userId), result).subscribe(
                (response => { }))
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

    modify = () => this.modifyFlag = !this.modifyFlag;

    delete(emoji: string) {

        let lista = this.emojiList.split(", ");

        //trova l'elemento e lo cancella
        const index = lista.indexOf(emoji);
        if (index !== -1) {
            lista.splice(index, 1);
        }

        // rimuovere le [ ] e "  dalla stringa e aggiunta di spazio dopo ogni virgola.
        this.emojiList = lista.join(', ').replace(/[\[\]"']/g, '');

        //if (this.emojiList == null) this.emojiList = "";
        this.userService.getUserId().subscribe(userId => {
            this.emojiService.updateEmojiList(parseInt(userId), this.emojiList).subscribe(
                (response => { }))
        });
        this.getList()
    }
}
