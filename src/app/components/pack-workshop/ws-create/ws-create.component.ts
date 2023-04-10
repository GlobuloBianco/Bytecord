import { Component, OnInit } from '@angular/core';
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
    displayList: string[] = ['']; // lista emoji utente
    requestList: string[] = []; // lista requested pack
    constructor(private packsService: PacksService, private userService: UserService, private emojiService: EmojiService) { }

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
        if(this.packName == "") return console.log("nome è vuoto")
        if (this.requestList.length == 0 || this.requestList[0] == '') {
            return console.log("è vuoto riprova");
        }
        let ListToString = this.emojiService.commaFix(this.requestList.toString());
        let packInfo = { nome: this.packName, lista: ListToString };
        this.packsService.requestPack(packInfo).subscribe(response => {
            console.log(response);
        })
        this.formReset();
    }

    add(emoji: string) {
        if (this.requestList.includes(emoji)) {
            console.log("gia inserito")
        } else {
            this.requestList.push(emoji)
        }
    }

    remove(emoji: string) {
        this.requestList = this.requestList.filter(e => e !== emoji);
    }

    formReset() {
        this.packName = '';
        this.requestList = [];
    }
}
