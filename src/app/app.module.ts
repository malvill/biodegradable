import {
  TuiButtonModule,
  TuiDialogModule,
  TuiDropdownModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiRootModule,
  TuiSvgModule
} from "@taiga-ui/core";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {PolymersComponent} from "./components/polymers/polymers.component";
import {PolymerCardComponent} from "./components/polymer-card/polymer-card.component";
import {HttpClientModule} from "@angular/common/http";
import {ApiPolymersClient} from "./services/api-polymers.client";

@NgModule({
  declarations: [
    AppComponent,
    PolymersComponent,
    PolymerCardComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiButtonModule,
    HttpClientModule,
    TuiDropdownModule,
    TuiHostedDropdownModule,
    TuiExpandModule,
    TuiSvgModule
  ],
  providers: [ApiPolymersClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
