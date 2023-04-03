import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    username = "Profile";
    authorized: boolean = false;

    constructor(private authService: AuthService, private userService: UserService) { }

    ngOnInit(): void {
        this.checkAuthorization();
    }

    logout = () => this.authService.logout();

    checkAuthorization = () => {
        this.userService.getAuthorization().subscribe(role => {
            (role == 'ADMIN') ? this.authorized = true : this.authorized = false;
        });
        this.setUsername();
    }

    setUsername() {
        this.userService.getUsername().subscribe(result => {
            this.username = result;
        })
    }


}
