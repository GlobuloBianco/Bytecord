import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmojiComponent } from './components/emoji/emoji.component';
import { StarterComponent } from './components/starter/starter.component';
import { Error404Component } from './auth/error404/error404.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PacksComponent } from './components/dashboard/d-packs/packs.component';
import { PackWorkshopComponent } from './components/pack-workshop/pack-workshop.component';
import { WsPacksComponent } from './components/pack-workshop/ws-packs/ws-packs.component';
import { WsCreateComponent } from './components/pack-workshop/ws-create/ws-create.component';
import { DApproveComponent } from './components/dashboard/d-approve/d-approve.component';

const routes: Routes = [
    // start section
    { path: '', component: StarterComponent },
    // -------- Auth section -------- //
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    // -------- components section -------- //
    { path: 'emoji', component: EmojiComponent, canActivate: [AuthGuard] },
    //workshop
    { path: 'packs', component: PackWorkshopComponent, canActivate: [AuthGuard] },
    { path: 'packs/create', component: WsCreateComponent, canActivate: [AuthGuard] },
    { path: 'packs/:type', component: WsPacksComponent, canActivate: [AuthGuard] },
    // dashboard section
    { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
    { path: 'dashboard/packs', component: PacksComponent, canActivate: [AdminGuard] },
    { path: 'dashboard/approve', component: DApproveComponent, canActivate: [AdminGuard] },
    // default route
    { path: '', redirectTo: '/', pathMatch: 'full' },
    { path: 'error/:reason', component: Error404Component },
    { path: '**', component: Error404Component }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
