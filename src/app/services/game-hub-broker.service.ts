import { Game } from './../models/game';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Player } from './../models/player';
import { Deck } from './../models/deck';
import { Observable, of, observable } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameHubBrokerService {
  private holdem: TexasHoldEm;
  private simplePlayers = new Array<any>();

  playersList: Observable<any[]>;

  game: Observable<any[]>;
  plyrsDoc: AngularFirestoreDocument<Player>;
  plyrs: Observable<Player>;

  plyrsColRef: AngularFirestoreCollection<Player>;
  plyrsCol: Observable<Player[]>;

  constructor(protected firestore: AngularFirestore) {
    this.game = firestore.collection('NEWGAME').valueChanges();

    this.plyrsColRef = firestore.collection<Player>('Game3', ref => ref.where('GameRef', '==', 'Game3'));
    this.plyrsColRef.valueChanges().subscribe(elem => {
      // tslint:disable-next-line:no-debugger
      debugger;
      return of(elem);
    });

    this.plyrs = this.plyrsDoc.valueChanges();
    // this.plyrsDoc = firestore.collection('NEWGAME').doc('Players');
    // this.plyrs = this.plyrsDoc.valueChanges();

    // this.plyrsDoc.valueChanges().forEach((elem) => {

    //   // tslint:disable-next-line:no-debugger
    //   debugger;
    // });
    // this.playersList = db.list('/players').valueChanges();
  }

  NewTexasHoldEmGame(holdemGame: TexasHoldEm) {
    // this.firestore.collection('NEWGAME').doc('Players').update({
      // firebase.firestore.FieldValue.arrayu
      // regions: this.firestore.FieldValue.arrayUnion('greater_virginia')
    // });
    this.holdem = holdemGame;
  }

  AddPlayer(player: Player) {
    this.holdem.Players.push(player);
    this.simplePlayers.push({Name: player.name, Stack: player.GetStack()});
    // tslint:disable-next-line:no-debugger
    // debugger;
    this.firestore.collection('NEWGAME').doc('Players').set({Players : this.simplePlayers});
    // firebase.firestore.FieldValue.
  }

  ShowFireBaseItem(): Observable<any[]> {
    return this.game;
  }

  ShowFireBasePlayers(): Observable<Player> {
    return this.plyrs;
  }

  CurrentHoldEmGame(): TexasHoldEm {
    return this.holdem;
  }
}
