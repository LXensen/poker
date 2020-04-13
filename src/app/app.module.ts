import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TexasHoldEmGameComponent } from './texas-hold-em-game/texas-hold-em-game.component';
import { PlayerComponentComponent } from './player-component/player-component.component';
import { environment } from '../environments/environment';
import { TableComponentComponent } from './table-component/table-component.component';

@NgModule({
  declarations: [
    AppComponent,
    TexasHoldEmGameComponent,
    PlayerComponentComponent,
    TableComponentComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
