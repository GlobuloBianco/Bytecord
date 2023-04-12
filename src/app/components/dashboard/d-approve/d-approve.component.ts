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
        this.packsService.getAllByType("PENDING").subscribe((response) => {
            this.packsList = response;
            console.log(response)
        });
    }

    toArray = (list: string) => list.split(', ');

    calcDate = (date: string) => {
        const date1 = new Date(date);
        const date2 = new Date();

        const diffTime = Math.abs(date2.getTime() - date1.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays != 1) {
            return `${diffDays} days ago`;
        } else {
            return `${diffDays} day ago`;
        }
    }
}
