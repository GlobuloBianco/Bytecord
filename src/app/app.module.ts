import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './interceptors/auth.interceptor';
//---- components ----//
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StarterComponent } from './components/starter/starter.component';
import { EmojiComponent } from './components/emoji/emoji.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { Error404Component } from './auth/error404/error404.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PacksComponent } from './components/dashboard/d-packs/packs.component';
import { PackWorkshopComponent } from './components/pack-workshop/pack-workshop.component';
import { WsPacksComponent } from './components/pack-workshop/ws-packs/ws-packs.component';
import { WsCreateComponent } from './components/pack-workshop/ws-create/ws-create.component';


@NgModule({
    declarations: [
        AppComponent,
        NavbarComponent,
        StarterComponent,
        EmojiComponent,
        LoginComponent,
        SignupComponent,
        Error404Component,
        DashboardComponent,
        PacksComponent,
        PackWorkshopComponent,
        WsPacksComponent,
        WsCreateComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
