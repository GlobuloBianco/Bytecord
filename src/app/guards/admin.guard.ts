import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router, private userService: UserService) { }

    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (!this.authService.isLogged()) return false;

        return this.userService.getAuthorization().pipe(
            map((role) => {
                if (role === 'ADMIN') {
                    return true;
                } else {
                    this.router.navigate(['/error/unauthorized']);
                    return false;
                }
            })
        );
    }

}
