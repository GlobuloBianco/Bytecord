import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
    }

    onSubmit() {
        if (!(this.usernameValid && this.emailValid && this.passwordValid)) {
            alert("Please enter valid input.");
            return;
          }

        const body = { email: this.email, username: this.username, password: this.password };
        this.http.post('http://localhost:8080/api/auth/signup', body).subscribe(
            response => {
                console.log("successo");
                this.router.navigate(['/login']);
            },
            error => {
                console.log("fallito");
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
        const regex = /^[a-zA-Z0-9]{3,16}$/; //solo numeri e lettere | min-max 3-16 caratteri
        return regex.test(input);
    }
}
