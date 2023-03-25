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
    constructor(private http: HttpClient, private router: Router) { }

    ngOnInit(): void {
    }

    onSubmit() {
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

    //-----Validazione Form-----//

}
