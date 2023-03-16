import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({  providedIn: 'root' })

export class AuthGuard implements CanActivate {

    constructor( private router: Router, private authService: AuthService ) {}

    canActivate( route: ActivatedRouteSnapshot, state: RouterStateSnapshot)
    : Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        const utente: boolean = this.authService.isLogged();
        if (utente) { //se il token è presente
            return true;
        }
        this.router.navigate(['/login']);
        return false;
    }
}
