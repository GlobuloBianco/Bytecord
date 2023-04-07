import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { EmojiService } from 'src/app/services/emoji.service';
import { PacksService } from 'src/app/services/packs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-pack-workshop',
    templateUrl: './pack-workshop.component.html',
    styleUrls: ['./pack-workshop.component.scss']
})
export class PackWorkshopComponent implements OnInit {
    packs: any = [];
    qty: number = 0;
    popUp: boolean = false;
    packDetails: string[] = [];

    constructor(private packsService: PacksService, private http: HttpClient, private authService: AuthService, private emojiService: EmojiService, private userService: UserService) { }

    ngOnInit(): void {
        this.getAllPacks();
    }

    getAllPacks() {
        this.packsService.getAllPacks().subscribe((response) => {
            this.packs = response;
            this.packs.forEach((pack: any) => { //primo emoji della lista
                pack.firstEmoji = pack.lista.substring(0, pack.lista.indexOf(','));
            });
        });
    }

    onDetailsClick(e: any) {
        this.popUp = true;
        this.packDetails = (e.lista).split(", ");
        this.qty = this.packDetails.length;
    }

    confirmNo = () => this.popUp = false;
    confirmYes = () => {
        this.userService.getUserId().subscribe(id => {
            this.emojiService.getEmojiList(parseInt(id)).subscribe(
                (response) => {
                    let finalList = (this.emojiService.dataToArray(response).concat(this.packDetails)).toString();
                    this.emojiService.updateEmojiList(this.emojiService.commaFix(this.emojiService.toDatabaseFormat(finalList))).subscribe(
                        (response => {
                            this.popUp = false;
                        })
                    );

                }
            )
        })
    }
}
