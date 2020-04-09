import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TexasHoldEmGameComponent } from './texas-hold-em-game/texas-hold-em-game.component';
import { PlayerComponentComponent } from './player-component/player-component.component';

@NgModule({
  declarations: [
    AppComponent,
    TexasHoldEmGameComponent,
    PlayerComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
