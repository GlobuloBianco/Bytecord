import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-starter',
    templateUrl: './starter.component.html',
    styleUrls: ['./starter.component.scss']
})
export class StarterComponent implements OnInit {
    Login = "Login In";
    constructor(private router: Router, private userService: UserService, private authService: AuthService) { }

    ngOnInit(): void {
        this.isLogged();
    }

    showMore = () => window.location.href = '#content';
    scrollTo = (e: HTMLElement) => e.scrollIntoView();
    isLogged() {
        let compare: boolean = false;
        this.authService.isLogged().subscribe(Response => compare = Response);
        if(compare) {
            this.userService.getUsername().subscribe(result => {
                this.Login = result;
            })
        }
    }
}
