import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { StarterComponent } from './components/starter/starter.component';
import { AuthGuard } from './components/guards/auth-guard.guard';
import { Error404Component } from './auth/error404/error404.component';

const routes: Routes = [
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: '', component: StarterComponent },
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },

    { path: '404/:reason', component: Error404Component},
    { path: '**', component: Error404Component}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
