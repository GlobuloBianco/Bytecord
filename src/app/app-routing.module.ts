import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { StarterComponent } from './components/starter/starter.component';
import { Error404Component } from './auth/error404/error404.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PacksComponent } from './components/dashboard/d-packs/packs.component';
import { PackWorkshopComponent } from './components/pack-workshop/pack-workshop.component';

const routes: Routes = [
    // start section
    { path: '', component: StarterComponent },
    // -------- components section -------- //
    { path: 'homepage', component: HomepageComponent, canActivate: [AuthGuard] },
    { path: 'packs', component: PackWorkshopComponent, canActivate: [AuthGuard] },
    // auth section
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    // dashboard section
    { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
    { path: 'dashboard/packs', component: PacksComponent, canActivate: [AdminGuard] },

    // default route
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'error/:reason', component: Error404Component},
    { path: '**', component: Error404Component}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
