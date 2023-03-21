import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    //form login

    constructor(private http: HttpClient, private router: Router, private authServ: AuthService) { }

    ngOnInit(): void {
    }

    //form submit
    onSubmit() {
        this.login();

    }

    //login---------------------
    username: string = '';
    password: string = '';

    login() {
        const dati = { username: this.username, password: this.password };
            this.authServ.login(dati)
            .subscribe(response => {
                // mettere nello localstorage il token
                sessionStorage.setItem('token', response.token);
                console.log('successo');
                this.router.navigate(['/homepage']);
            },
                error => {
                    console.log('Le credenziali non sono corrette');
                })

    }
}
