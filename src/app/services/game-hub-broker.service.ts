import { Card } from './../models/card';
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
  private rootPaceHolder: string;
  private holdem: TexasHoldEm;

  // playersList: Observable<any[]>;

  game: Observable<any[]>;
  // plyrsDoc: AngularFirestoreDocument<IPlayer>;
  // plyrs: Observable<IPlayer>;

  plyrsColRef: AngularFirestoreCollection<any>;
  plyrsCol: Observable<any[]>;
  gameState: Observable<any>;

  constructor(protected firestore: AngularFirestore) {
    this.game = firestore.collection('Game3').valueChanges();

    this.plyrsColRef = firestore.collection<Player>('Game3', ref => ref.where('gameRef', '==', 'Game3'));
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
    this.rootPaceHolder = 'Game' + Math.random().toString(36).substr(2, 9);
    this.holdem = holdemGame;
  }

  AddPlayer(player: Player) {
      // Get the document ref of a new player and set it
      player.gameRef = 'Game3';
      // this.firestore.collection('Game3').add({stack: player.stack, name: player.folded, gameRef: 'Game3'});
      this.firestore.collection('Game3').add(player)
      .then((docRef) => {
        this.firestore.collection('Game3').doc(docRef.id).update({docRef: docRef.id});
    });
  }

  ShowFireBaseItem(): Observable<any[]> {
    return this.game;
  }

  GetFlop(): Observable<any> {
    return this.firestore.collection('Game3').doc('Hand').valueChanges();
  }

  GetPlayers(): Observable<Player[]> {
      return this.plyrsCol;
  }

  IsGameReady(): Observable<any> {
    return this.gameState;
  }

  LoadPlayer(docRef: string): Observable<any> {
    return this.firestore.collection('Game3').doc<Player>(docRef).valueChanges();
  }

  CurrentHoldEmGame(): TexasHoldEm {
    if (!this.holdem.Deck) {

    }
    return this.holdem;
  }

  FoldPlayer(hand: string, player: string) {
    // remove this player from the list of PlayingPlayers
    const playerref = this.firestore.collection('Game3').doc(player);
    playerref.update({folded: true, cardOne: 'gray_back', cardTwo: 'gray_back'});
  }

  NewHand() {
    // reset folded bool
      this.firestore.collection('Game3', ref => ref.where('gameRef', '==', 'Game3')
      .where('canBet', '==', true))
      .get()
      .subscribe((val) => {
        const batch = this.firestore.firestore.batch();
        val.forEach((doc) => {

        const batchRef = this.firestore.firestore.collection('Game3').doc(doc.data().docRef);
        batch.update(batchRef, {folded: false, cardOne: '', cardTwo: ''});
        // const dto = {}; dto['folded'] = newHand ? '' : card.url;
        // batch.update(batchRef, dto);
        });
        batch.commit().then(() => {
          const flopRef = this.firestore.collection('Game3').doc('Hand');

          flopRef.update({cardOne: 'blue_back',
            cardTwo: 'blue_back',
            cardThree: 'blue_back',
            cardFour: 'blue_back',
            cardFive: 'blue_back'});
        });
      });

      this.CurrentHoldEmGame().Deck.Shuffle();
  }

  DealHand() {
    const newHand = false;
    //  only deal to players that haven't folded
    this.firestore.collection('Game3', ref => ref.where('gameRef', '==', 'Game3')
        .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((val) => {
          const batch = this.firestore.firestore.batch();
          val.forEach((doc) => {

          const batchRef = this.firestore.firestore.collection('Game3').doc(doc.data().docRef);
          for (let i = 0; i < 2; i++) {
            const whichCard = i === 0 ? 'One' : 'Two';
            const card = this.CurrentHoldEmGame().Deck.cards.pop();

            // const dto = {}; dto['card' + whichCard] = newHand ? '' : card.url;
            const dto = {}; dto['card' + whichCard] = card.url;
            batch.update(batchRef, dto);
          }
        });
          batch.commit().then(() => {

          });
        });
  }

  DealTurn() {
    const flopRef = this.firestore.collection('Game3').doc('Hand');
    this.CurrentHoldEmGame().Deck.cards.pop();

    flopRef.update({cardFour: this.CurrentHoldEmGame().Deck.cards.pop().url});
  }

  DealRiver() {
    const flopRef = this.firestore.collection('Game3').doc('Hand');
    this.CurrentHoldEmGame().Deck.cards.pop();

    flopRef.update({cardFive: this.CurrentHoldEmGame().Deck.cards.pop().url});
  }

  DealFlop() {
    const flopRef = this.firestore.collection('Game3').doc('Hand');
    this.CurrentHoldEmGame().Deck.cards.pop();

    flopRef.update({cardOne: this.CurrentHoldEmGame().Deck.cards.pop().url,
      cardTwo: this.CurrentHoldEmGame().Deck.cards.pop().url,
      cardThree: this.CurrentHoldEmGame().Deck.cards.pop().url});
  }
  UpdatePlayerStack(amount: number, player: string) {
    const playerref = this.firestore.collection('Game3').doc(player);
    playerref.update({stack: amount});
  }

  StartGame(players: Array<Player>) {
    // players.forEach(player => {
    //   // Get the document ref of a new player and set it
    //   player.gameRef = 'Game3';
    //   // this.firestore.collection('Game3').add({stack: player.stack, name: player.folded, gameRef: 'Game3'});
    //   this.firestore.collection('Game3').add(player)
    //   .then((docRef) => {
    //     debugger;
    //     this.firestore.collection('Game3').doc(docRef.id).update({docRef: docRef.id});
    //   });
    // });
    this.firestore.collection('Game3').doc('GameState').update({Ready: true});
  }
}
