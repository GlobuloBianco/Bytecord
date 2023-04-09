import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = "Bytecord"
    statusNavbar = true;
    urlFE = 'http/localhost:4200';
    constructor(private router: Router) { }

    ngOnInit() { }
}
