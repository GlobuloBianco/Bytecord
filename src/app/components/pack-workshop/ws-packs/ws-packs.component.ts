import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { EmojiService } from 'src/app/services/emoji.service';
import { PacksService } from 'src/app/services/packs.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-ws-packs',
    templateUrl: './ws-packs.component.html',
    styleUrls: ['./ws-packs.component.scss']
})
export class WsPacksComponent implements OnInit {
    title = "Packs";
    packs: any = [];
    qty: number = 0;
    popUp: boolean = false;
    packDetails: string[] = [];

    constructor(private packsService: PacksService, private http: HttpClient, private authService: AuthService, private emojiService: EmojiService, private userService: UserService, private route: ActivatedRoute, private router: Router) { }

    ngOnInit(): void {
        this.getAllPacks();
    }

    getAllPacks() {
        let type: string = this.route.snapshot.paramMap.get('type')?.toUpperCase() || "";
        if (type == "") return console.error("Error: Not a valid path:" + type);
        if (type == "DEFAULT") (this.getData(type), this.title = type); // Sezione pack default
        if (type == "COMMUNITY") (this.getData("APPROVED"), this.title = type); // sezione pack Community
    }

    getData = (type: String) => {
        this.packsService.getAllByType(type).subscribe((response) => {
            this.packs = response;
            this.packs.forEach((pack: any) => {
                pack.firstEmoji = pack.lista.substring(0, pack.lista.indexOf(',')); //primo emoji della lista
                pack.workshopImg = Math.floor(Math.random() * 3) + 1;
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
                            this.router.navigate(['/emoji'])
                        })
                    );
                }
            )
        })
    }

    randomPic(pack: any) {
        const card = 'assets/cards/card-';
        let num = pack.workshopImg;
        switch (num) {
            case 1:
                return card + '1.svg'
            case 2:
                return card + '2.svg';
            case 3:
                return card + '3.svg';
        }
        return 'assets/cards/card-pink.svg';
    }
}
