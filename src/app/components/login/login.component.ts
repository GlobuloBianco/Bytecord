import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    constructor(private http: HttpClient, private router: Router, private authServ: AuthService) { }

    ngOnInit(): void { }

    //login---------------------
    username: string = '';
    password: string = '';
    showPassword: boolean = false;
    usernameValid: boolean = false;
    passwordValid: boolean = false;
    erroreCredenziali: boolean = false;

    home = () => window.location.href = '/';

    onSubmit() {
        const dati = { username: this.username, password: this.password };
        this.authServ.login(dati)
            .subscribe(response => {
                //nota: loggato = true
                if (response == false) {
                    this.erroreCredenziali = true;
                    setTimeout(()=>{
                        this.erroreCredenziali = false;
                    }, 2500);
                } else this.router.navigate(['/homepage']);
            })
    }

    togglePassword() {
        let passwordCheck = document.getElementById('passwordCheck') as HTMLInputElement;
        // show - hide password
        !this.showPassword ? (passwordCheck.setAttribute('type', 'text'),this.showPassword = true) : (passwordCheck.setAttribute('type', 'password'),this.showPassword = false);
    }

        //-----Validazione-----//
        checkInput(input: string): boolean {
            return this.authServ.checkInput(input);
        }
}
