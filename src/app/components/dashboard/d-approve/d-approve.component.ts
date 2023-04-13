import { Component, OnInit } from '@angular/core';
import { EmojiService } from 'src/app/services/emoji.service';
import { PacksService } from 'src/app/services/packs.service';

@Component({
    selector: 'app-d-approve',
    templateUrl: './d-approve.component.html',
    styleUrls: ['./d-approve.component.scss']
})
export class DApproveComponent implements OnInit {
    packsList: any = [];
    flag: boolean = false;
    constructor(private packsService: PacksService, private emojiService: EmojiService) { }

    ngOnInit(): void {
        this.getAllPacks();
    }

    getAllPacks = () => {
        //sfondo pack
        let bg = [2, 3, 1];
        let bgNum = 0;
        //sfondo emoji
        let emojiBg = [6, 5, 4];
        let emojiNum = 0;
        this.packsService.getAllByType("PENDING").subscribe((response) => {
            this.packsList = response;
            this.packsList.forEach((pack: any) => {
                //sfondo pack
                pack.randomBackground = bg[bgNum];
                bgNum = (bgNum + 1) % bg.length;
                //sfondo emoji
                pack.randomEmojiBackground = emojiBg[emojiNum];
                emojiNum = (emojiNum + 1) % emojiBg.length;
                //flag
                pack.flag = false;
            });
        });
    }

    toArray = (list: string) => list.split(', ');

    calcDate = (date: string) => {
        let date1 = new Date(date);
        let date2 = new Date();
        let diffTime = Math.abs(date2.getTime() - date1.getTime());
        // calcolo giorno         |           ms - sec - min - ore
        let diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays}d ago`;
    }

    expand = () => this.packsList.forEach((pack: any) => pack.flag = true );
    collapse = () => this.packsList.forEach((pack: any) => pack.flag = false );

    reject = (pack: any) => {
        this.packsService.reviewPack(pack.nome, "REJECTED").subscribe((() => {
            this.getAllPacks();
        }));
    }
    approve = (pack: any) => {
        this.packsService.reviewPack(pack.nome, "APPROVED").subscribe((() => {
            this.getAllPacks();
        }));
    }

    getBackground(randomBg: number) {
        let path = "../../../../assets/cards/";
        switch (randomBg) {
            case 1:
                return `url('${path}card-1.svg')`;
            case 2:
                return `url('${path}card-2.svg')`;
            case 3:
                return `url('${path}card-3.svg')`;
            case 4:
                return `url('${path}simple-1.svg')`;
            case 5:
                return `url('${path}simple-2.svg')`;
            case 6:
                return `url('${path}simple-3.svg')`;
            default:
                return "";
        }
    }
}
