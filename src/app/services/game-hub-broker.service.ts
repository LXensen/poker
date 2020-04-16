import { Game } from './../models/game';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Player } from './../models/player';
import { Deck } from './../models/deck';
import { Observable, BehaviorSubject, Subject } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameHubBrokerService {
  private holdem: TexasHoldEm;

  playersList: Observable<any[]>;

  game: Observable<any[]>;
  plyrsDoc: AngularFirestoreDocument<Player>;
  plyrs: Observable<Player>;

  plyrsColRef: AngularFirestoreCollection<any>;
  plyrsCol: Observable<any[]>;
  gameState: Observable<any>;

  constructor(protected firestore: AngularFirestore) {
    this.game = firestore.collection('NEWGAME').valueChanges();

    this.plyrsColRef = firestore.collection<Player>('Game3', ref => ref.where('GameRef', '==', 'Game3'));
    this.plyrsCol = this.plyrsColRef.valueChanges(); // .subscribe(elem => {
    //   // tslint:disable-next-line:no-debugger
    //   debugger;
    //   // return of(elem);
    // });

    this.gameState = firestore.collection('Game3').doc('GameState').valueChanges();
    // this.plyrsDoc = firestore.collection('NEWGAME').doc('Players');
    // this.plyrs = this.plyrsDoc.valueChanges();

    // this.plyrsDoc.valueChanges().forEach((elem) => {

    //   // tslint:disable-next-line:no-debugger
    //   debugger;
    // });
    // this.playersList = db.list('/players').valueChanges();
  }

  // getGameState(): Observable<boolean> {
  //   return this.gameReady.asObservable();
  // }

  NewTexasHoldEmGame(holdemGame: TexasHoldEm) {
    // this.firestore.collection('NEWGAME').doc('Players').update({
      // firebase.firestore.FieldValue.arrayu
      // regions: this.firestore.FieldValue.arrayUnion('greater_virginia')
    // });
    this.holdem = holdemGame;
  }

  AddPlayer(player: Player) {
    this.firestore.collection('Game3').add({
      GameRef: 'Game3',
      Name: player.name,
      Stack: player.GetStack()
    });
    // this.holdem.Players.push(player);
    // this.simplePlayers.push({Name: player.name, Stack: player.GetStack()});
    // tslint:disable-next-line:no-debugger
    // debugger;
    // this.firestore.collection('NEWGAME').doc('Players').set({Players : this.simplePlayers});
    // firebase.firestore.FieldValue.
  }

  ShowFireBaseItem(): Observable<any[]> {
    return this.game;
  }

  ShowFireBasePlayersCollection(): Observable<any[]> {
      this.plyrsCol.subscribe((val) => {
        val.forEach(res => {
          // tslint:disable-next-line:no-debugger
          // debugger;
          // allplayers.push(new Player(res.Stack, res.Name));
          // this.arrayPlayers.push(new Player(res.Stack, res.Name));
      });
    });
    // tslint:disable-next-line:no-debugger
    //  debugger;
      return this.plyrsCol;
  }

  IsGameReady(): Observable<any> {
    return this.gameState;
  }

  LoadPlayer(docRef: string): Observable<any> {
    return this.firestore.collection('Game3').doc(docRef).valueChanges();
  }

  ShowFireBasePlayers(): Observable<Player> {
    return this.plyrs;
  }

  CurrentHoldEmGame(): TexasHoldEm {
    return this.holdem;
  }

  StartGame(players: Array<Player>) {
    players.forEach(player => {
      this.firestore.collection('Game3').doc(player.DocumentRef()).set({stack: player.GetStack(), name: player.name, gameRef: 'Game3'});
    });

    this.firestore.collection('Game3').doc('GameState').update({Ready: true});
  }
}
