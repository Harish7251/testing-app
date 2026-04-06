import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { SideBar } from './side-bar/side-bar';
import { NavBar } from './nav-bar/nav-bar';
import { Dashboard } from './dashboard/dashboard';
import { Main } from './main/main';
import { Login } from './login/login';
import { PageUnderDevelopment } from './page-under-development/page-under-development';
import { Stepper } from './stepper/stepper';

@NgModule({
  declarations: [
    App,
    SideBar,
    NavBar,
    Dashboard,
    Main,
    Login,
    PageUnderDevelopment,
    Stepper
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule

  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
