import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

    email: string = "";
    username: string = "";
    password: string = "";
    showPassword: boolean = false;
    usernameValid: boolean = false;
    emailValid: boolean = false;
    passwordValid: boolean = false;
    erroreUsername: boolean = false;
    constructor(private http: HttpClient, private router: Router, private authServ: AuthService) { }

    ngOnInit(): void {}

    home = () => window.location.href = '/';

    onSubmit() {
        const body = { email: this.email, username: this.username, password: this.password };
        this.http.post('http://localhost:8080/api/auth/signup', body).subscribe(
            response => {
                this.router.navigate(['/login']);
            },
            error => {
                this.erroreUsername = true;
                setTimeout(()=>{
                    this.erroreUsername = false;
                }, 2500);
            }
        );
    }

    togglePassword() {
        let passwordCheck = document.getElementById('passwordCheck') as HTMLInputElement;
        // show - hide password
        !this.showPassword ? (passwordCheck.setAttribute('type', 'text'),this.showPassword = true) : (passwordCheck.setAttribute('type', 'password'),this.showPassword = false);
    }

    //-----Validazione Regex-----//
    checkInput(input: string): boolean {
        return this.authServ.checkInput(input);
    }

    checkEmail(input: string): boolean {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return regex.test(input);
    }
}
