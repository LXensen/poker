import { Game } from './../models/game';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Player } from './../models/player';
import { Deck } from './../models/deck';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';

export interface Plyr { Name: string; Stack: number; }

@Injectable({
  providedIn: 'root'
})
export class GameHubBrokerService {
  private holdem: TexasHoldEm;

  game: Observable<any[]>;
  plyrDoc: AngularFirestoreDocument<Plyr>;
  plyr: Observable<Plyr>;
  allPlayersDoc: AngularFirestoreCollection<Plyr>;
  allPlayers: Observable<Plyr[]>;

  constructor(protected firestore: AngularFirestore) {
    this.game = firestore.collection('NEWGAME').valueChanges();
    this.plyrDoc = firestore.collection('NEWGAME').doc('Players');
    this.plyr = this.plyrDoc.valueChanges();

    this.allPlayersDoc = this.plyrDoc.collection('Players');
    this.allPlayers = this.allPlayersDoc.valueChanges();

  }

  NewTexasHoldEmGame(holdemGame: TexasHoldEm) {
    this.firestore.collection('NEWGAME').doc('Players').update({
      // firebase.firestore.FieldValue.arrayu
      // regions: this.firestore.FieldValue.arrayUnion('greater_virginia')
    });
    this.holdem = holdemGame;
  }

  AddPlayer(player: Player) {
    // tslint:disable-next-line:no-debugger
    debugger;
    this.firestore.collection('NEWGAME').doc('TEST').collection('Players').add({Name: 'Jen', Stack: 7});
    // firebase.firestore.FieldValue.
    this.holdem.Players.push(player);
  }

  ShowFireBaseItem(): Observable<any[]> {
    return this.game;
  }

  ShowFireBasePlayers(): any {

  }

  ShowFireBasePlayer(): Observable<any> {
    return this.plyr;
  }

  CurrentHoldEmGame(): TexasHoldEm {
    return this.holdem;
  }
}
