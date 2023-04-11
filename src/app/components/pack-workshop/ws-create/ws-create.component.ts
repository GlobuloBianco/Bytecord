import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmojiService } from 'src/app/services/emoji.service';
import { PacksService } from 'src/app/services/packs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-ws-create',
    templateUrl: './ws-create.component.html',
    styleUrls: ['./ws-create.component.scss']
})
export class WsCreateComponent implements OnInit {

    packName: string = ""; // nome requested pack
    displayList: string[] = []; // lista emoji utente
    requestList: string[] = []; // lista requested pack
    status: string = "ㅤ"; // status errore
    qty: number = 0; // qty aggiunto di emoji
    constructor(private packsService: PacksService, private userService: UserService, private emojiService: EmojiService, private router: Router) { }

    ngOnInit(): void {
        this.getList();
    }

    getList() {
        setTimeout(() => {
            this.userService.getUserId().subscribe(id => {
                this.emojiService.getEmojiList(parseInt(id)).subscribe(
                    (response) => {
                        let emojiList = '';
                        // check presenza
                        response.length == 0 || response == "" ? null : emojiList = response.trim();
                        this.displayList = this.emojiService.dataToArray(emojiList);
                    }
                )
            })
        }, 100);
    }

    onSubmit() {
        // ----- check ----- //
        this.packName = this.packName.trim();
        if (this.packName == "") this.status = "The pack name should contain something.";
        if (this.packName.length < 3 || this.packName.length > 12) this.status = "The pack name should be between 3 - 12 characters.";
        if (this.requestList.length < 5 || this.requestList.length > 30) {
            this.status = "The pack should contain between 5 to 30 emojis. [" + this.qty +"/30]";
        }
        //revert messaggio dopo errore
        if (this.status != "ㅤ") {
            setTimeout(() => {
                this.status = "ㅤ";
            }, 3000);
            return;
        }
        // richiesta salvataggio
        let ListToString = this.emojiService.commaFix(this.requestList.toString());
        let packInfo = { nome: (this.packName + " Pack"), lista: ListToString };
        this.packsService.requestPack(packInfo).subscribe(response => {
            this.status = "The pack has been submitted to be reviewed";
            this.formReset();
            setTimeout(() => {
                this.router.navigate(['/emoji']);
            }, 3000);
            return;
        },
        (error => {
            this.status = "The pack name is already taken, please choose another one."
            setTimeout(() => {
                this.status = "ㅤ";
            }, 3000);
            return;
        }))
    }

    add(emoji: string) {
        if (this.requestList.includes(emoji)) {
            console.log("The emoji is already in the requested list");
        } else {
            this.requestList.push(emoji);
            this.displayList = this.displayList.filter(e => e !== emoji);
            this.qty ++;
        }
    }

    remove(emoji: string) {
        this.requestList = this.requestList.filter(e => e !== emoji);
        this.displayList.unshift(emoji);
        this.qty --;
    }

    formReset() {
        this.packName = '';
        this.requestList = [];
        this.qty = 0;
    }

    capitalCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);
}
