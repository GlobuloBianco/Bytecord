import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    statusNavbar = true;
    urlFE = 'http/localhost:4200';
    constructor(private router: Router) { }

    ngOnInit() {

        // rileva il cambio di URL usando router.events
        this.router.events.subscribe((event) => {
            if (event instanceof NavigationEnd) {
                // aggiorna lo status del navbar in base alla URL
                this.statusNavbar = this.showNavbar(event.url);
            }
        });
    }

    showNavbar(url: string): boolean {
        if (url.startsWith('/login') || url.startsWith('/signup') || url.endsWith('/') || url.endsWith('#content')) {
            return false;
        } else {
            return true;
        }
    }
}
