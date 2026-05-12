import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { SideBar } from './side-bar/side-bar';
import { NavBar } from './nav-bar/nav-bar';
import { Dashboard } from './dashboard/dashboard';
import { Main } from './main/main';
import { Login } from './login/login';
import { PageUnderDevelopment } from './page-under-development/page-under-development';
import { Stepper } from './stepper/stepper';
import { Effect } from './effect/effect';
import { FestivalOverlay } from './festival-overlay/festival-overlay';
import { PaymentC } from './payment-c/payment-c';
import { ReportsUI } from './reports-ui/reports-ui';

@NgModule({
  declarations: [
    App,
    SideBar,
    NavBar,
    Dashboard,
    Main,
    Login,
    PageUnderDevelopment,
    Stepper,
    Effect,
    FestivalOverlay,
    PaymentC,
    ReportsUI
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BaseChartDirective

  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
