import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { AuthService } from 'src/app/services/auth.service';
import { PacksService } from 'src/app/services/packs.service';

@Component({
    selector: 'app-packs',
    templateUrl: './packs.component.html',
    styleUrls: ['./packs.component.scss']
})
export class PacksComponent implements OnInit {
    packs: any = [];
    constructor(private packsService: PacksService, private http: HttpClient, private authService: AuthService) { }

    ngOnInit(): void {
        this.getAllPacks();
    }

    getAllPacks() {
        this.packsService.getAllPacks().subscribe((response) => {
            this.packs = response;
            this.packs.forEach((pack: any) => { //primo emoji della lista
                return pack.lista = pack.lista.substring(0, pack.lista.indexOf(','));
            });
        });
    }
}
