import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-error404',
    templateUrl: './error404.component.html',
    styleUrls: ['./error404.component.scss']
})
export class Error404Component implements OnInit {
    errorExpired: boolean = false;
    message = "";

    constructor(private authService: AuthService, private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.reasonOfError();
    }

    reasonOfError() {
        const reason = this.route.snapshot.paramMap.get('reason');
        if (reason === "expired") {
            this.errorExpired = true;
        } else {
            this.randomPick();
        }
    }

    randomPick() {
        const errorList = [
            "Oops! Looks like you've stumbled upon a lost page. Let's go back home together!",
            "We searched high and low, but we couldn't find what you were looking for. Why don't you come back home with us?",
            "You've reached a dead end. But don't worry, we've got a shortcut back to our homepage!",
            "Looks like this page took a wrong turn. Let's get you back on track by heading back to our homepage!",
            "This page seems to be on vacation. How about we take you back to our homepage instead?",
            "Oh no! The page you're looking for is missing in action. But don't worry, we can help you find your way back to our homepage!",
            "Sorry, we couldn't find what you were looking for. But our homepage is always here to welcome you with open arms!"
        ];
        const randomIndex = Math.floor(Math.random() * errorList.length);
        this.message = errorList[randomIndex];
    }

    logout = () => this.authService.logout();
}
