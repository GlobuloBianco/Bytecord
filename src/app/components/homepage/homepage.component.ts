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

    serverUrl = this.authServ.getServerUrl(); // backend
    emojiList: string = ''; // lista ricevuta
    displayList: string[] = ['']; // lista da display in html
    isEmpty: boolean = false; // boolean lista

    constructor(private authServ: AuthService, private emojiService: EmojiService, private userService: UserService) { }

    ngOnInit(): void {
        this.getList(); //ritorna gli emoji salvati nel database
    }

    //------------ // ---------------[ Lista utente dal database ]--------------- //------------ //
    getList() {
        //prende l'id dell'utente e prende la sua lista emoji
        this.userService.getUserId().subscribe(id => {
            this.emojiService.getEmojiList(parseInt(id)).subscribe(
                (response) => {
                    // check presenza
                    response.length == 0 || response == "" ? this.isEmpty = true : (this.emojiList = response.trim(), this.aggiorna());
                    this.displayList = this.emojiService.emojiToArray(this.emojiList);
                }
            )
        })
    }

    //------------ // ---------------[ Aggiunta emoji ]--------------- //------------ //
    addInput = ''; // inputfield

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
        this.emojiService.updateEmojiList(result).subscribe((response => { }));

        this.aggiorna(); //check lista vuota
        this.getList();
    }

    aggiorna = () => (this.isEmpty = this.emojiList.length == 0); // Vuoto = TRUE | Pieno = FALSE

    // --------------- Salvataggio su clipboard --------------- //
    copyClipboard = (emoji: string) => {
        navigator.clipboard.writeText(emoji);
        console.log("copiato");
    }

    //------------ // ---------------[ Sezione Settings ]--------------- //------------ //
    settingsFlag: boolean = false; // modal settings
    settingsConfirm: boolean = false; //import menu
    modifyFlag: boolean = false; //modifica

    modify = () => this.modifyFlag = !this.modifyFlag;
    toggleSettings = () => this.settingsFlag = !this.settingsFlag;
    confirmMenu = () => this.settingsConfirm = !this.settingsConfirm;

    delete(emoji: string) {
        let lista = this.emojiService.emojiToArray(this.emojiList);
        //trova l'elemento e lo cancella
        const index = lista.indexOf(emoji);
        if (index !== -1) lista.splice(index, 1);
        // rimuovere le [ ] e "  dalla stringa e aggiunta di spazio dopo ogni virgola.
        this.emojiList = this.emojiService.toDatabaseFormat(lista.join(', '));
        this.emojiList = this.emojiList || " ";
        this.emojiService.updateEmojiList(this.emojiList).subscribe((response => { }));
        this.getList();
    }
    // --------------- Import --------------- //
    importConfirm: boolean = false; //menu confirm
    importedList: string[] = [""]; //imported emoji
    qty: number = 0; // qty emoji importato

    // validazione del file import
    selectedFile(event: any) {
        // prendere il primo file disponibile
        const file: File = event.target.files[0];
        if (file.type !== 'text/plain') {
            console.error('Selected file is not a text file!');
            return;
        }
        const reader: FileReader = new FileReader();
        reader.readAsText(file);
        // salvataggio alla lettura
        reader.onload = () => {
            let result: string = "";
            //check null
            if (reader.result != null) {
                const content: string = reader.result.toString();
                result = content;
            }
            //check validità
            if (!result.startsWith('http')) {
                console.error('Imported file content/format is invalid or corrupted!');
                return;
            }
            //--------aftercheck--------//
            this.confirmMenu();
            this.importConfirm = true;
            this.importedList = this.emojiService.emojiToArray(result);
            this.qty = 0;
            this.importedList.forEach(e => this.qty++) //calcolo di qty emoji
        };
    }
    //dopo la conferma
    addImported() {
        const fixedList = this.emojiService.commaFix(this.importedList.toString());
        let result = [this.emojiList, fixedList].join(", ");

        this.emojiService.updateEmojiList(result).subscribe((response => { }));
        this.confirmMenu();
        this.toggleSettings();
        this.getList();
    }
    // --------------- Export --------------- //
    export = () => {
        //creazione file txt
        let lista = this.emojiList;
        let file = new Blob([lista], { type: 'text/plain' });
        //creazione esecuzione oggetto download
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        a.download = "myEmojiList.txt";
        document.body.appendChild(a);
        a.click();
        //deleteAll la creazione
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }

    //------------ // ---------------[ Confirm Menu ]--------------- //------------ //
    confirmYes(tipo: string) {
        switch (tipo) {
            case "import": this.addImported();
                break;
            case "potato": console.log("patata");
                break;
            default:
                console.error("unknown type in confirm section ts.150");
        }
    }

    confirmNo = () => this.confirmMenu();
}
