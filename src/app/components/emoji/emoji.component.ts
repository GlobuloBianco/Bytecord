import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmojiService } from 'src/app/services/emoji.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-emoji',
    templateUrl: './emoji.component.html',
    styleUrls: ['./emoji.component.scss']
})
export class EmojiComponent implements OnInit {

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
        //prende l'id dell'utente e prende la sua lista emoji (0.1s di deplay per l'operazione assincrona)
        setTimeout(() => {
            this.userService.getUserId().subscribe(id => {
                this.emojiService.getEmojiList(parseInt(id)).subscribe(
                    (response) => {
                        // check presenza
                        response.length == 0 || response == "" ? this.isEmpty = true : (this.emojiList = response.trim(), this.update());
                        this.displayList = this.emojiService.dataToArray(this.emojiList);
                    }
                )
            })
        }, 100);
    }

    //------------ // ---------------[ Aggiunta emoji ]--------------- //------------ //
    addInput = ''; // inputfield
    errorInput = '';

    addEmoji() {
        let emojiUrl = this.addInput.trim(); // per eventuali spazi extra
        this.addInput = '';
        // check duplicati
        if (this.displayList.includes(emojiUrl)) {
            this.errorInput = "The desired Emoji is already in the list!.";
            setTimeout(() => {
                this.errorInput = "";
            }, 3000);
            return;
        }
        // check length dell url <=1 e >=150
        if (emojiUrl.length <= 1) return;
        if (emojiUrl.length >= 150) {
            this.errorInput = "The URL is too long! Please try another one.";
            setTimeout(() => {
                this.errorInput = "";
            }, 3000);
            return;
        }
        // Remove invalid Discord URLs
        if (emojiUrl.startsWith("https://discord.com/assets/")) {
            this.errorInput = "this emoji is already available by default! Please try another one.";
            setTimeout(() => {
                this.errorInput = "";
            }, 3000);
            return;
        }
        if (!emojiUrl.startsWith("https://cdn.discordapp.com/emojis/")) {
            this.errorInput = "Invalid or corrupt Discord emoji :C Please try another one.";
            setTimeout(() => {
                this.errorInput = "";
            }, 3000);
            return;
        }
        let result = [emojiUrl, this.emojiList].join(", ");
        result.trim();  //double check :)
        result.startsWith(",") ? (result = result.slice(1), result.trim()) : null
        // Invia la richiesta POST al backend per aggiornare la lista dell'utente
        this.emojiService.updateEmojiList(result).subscribe();
        this.update(); //check lista vuota
        this.getList();
    }

    update = () => (this.isEmpty = this.emojiList.length == 0); // Vuoto = TRUE | Pieno = FALSE

    // --------------- Salvataggio su clipboard --------------- //
    copyClipboard = (emoji: string) => {
        navigator.clipboard.writeText(emoji);
    }

    //------------ // ---------------[ Sezione Settings ]--------------- //------------ //
    settingsFlag: boolean = false; // modal settings
    settingsConfirm: boolean = false; //import menu
    modifyFlag: boolean = false; //modifica
    onModifyClick = () => {
        this.modifyFlag = !this.modifyFlag;
    }
    toggleSettings = () => this.settingsFlag = !this.settingsFlag;
    confirmMenu = () => this.settingsConfirm = !this.settingsConfirm;

    delete(emoji: string) {
        let lista = this.emojiService.dataToArray(this.emojiList);
        //trova l'elemento e lo cancella
        const index = lista.indexOf(emoji);
        if (index !== -1) lista.splice(index, 1);
        // rimuovere le [ ] e "  dalla stringa e aggiunta di spazio dopo ogni virgola.
        this.emojiList = this.emojiService.toDatabaseFormat(lista.join(', '));
        this.emojiList = this.emojiList || " ";
        this.emojiService.updateEmojiList(this.emojiList).subscribe();
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
                const content: string = reader.result.toString().trim();
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
            this.importedList = this.emojiService.dataToArray(result);
            this.qty = 0;
            this.importedList.forEach(e => this.qty++) //calcolo di qty emoji
        };
    }
    //dopo la conferma
    addImported() {
        const fixedList = this.emojiService.commaFix(this.importedList.toString());
        let result = [this.emojiList, fixedList].join(", ");
        this.emojiService.updateEmojiList(result).subscribe();
        this.confirmed();
        this.toggleSettings();
        this.getList();
    }
    // --------------- Export --------------- //
    export = () => {
        //creazione file txt
        let lista = this.emojiList;
        lista.startsWith(",") ? (lista = lista.slice(1), lista.trim()) : lista.trim();
        let file = new Blob([lista], { type: 'text/plain' });
        //creazione esecuzione oggetto download
        let a = document.createElement("a");
        let url = URL.createObjectURL(file);
        a.href = url;
        this.userService.getUsername().subscribe(response => {
            a.download = response + ".txt";
            document.body.appendChild(a);
            a.click();
        });
        //deleteAll la creazione
        setTimeout(() => {
            document.body.removeChild(a),
                window.URL.revokeObjectURL(url)
        }, 0);
    }
    // --------------- DeleteAll --------------- //
    deleteConfirm: boolean = false; //popup conferma
    deleteAll = () => {
        this.confirmMenu();
        this.deleteConfirm = true;
    }
    deleted = () => {
        this.emojiService.updateEmojiList(" ").subscribe();
        this.confirmed();
        this.toggleSettings();
        this.getList();
    }

    //------------ // ---------------[ Confirm Menu ]--------------- //------------ //
    confirmed() {
        this.confirmMenu();
        this.importConfirm = false;
        this.deleteConfirm = false;
    }

    confirmYes(tipo: string) {
        switch (tipo) {
            case "import": this.addImported();
                break;
            case "deleteAll": this.deleted();
                break;
            default:
                console.error("unknown type in Confirm section emoji.ts");
        }
    }
    confirmNo = () => this.confirmed();

    //------------ // ---------------[ Help Menu ]--------------- //------------ //
    helpFlag: boolean = false;
    toggleHelp = () => this.helpFlag = !this.helpFlag;
}
