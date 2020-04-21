import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Player } from './../models/player';
import { Observable, Subject } from 'rxjs';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GameHubBrokerService {
  private holdem: TexasHoldEm;
  private HAND = 'Hand';
  private GAME = 'Game3';
  private BLUECARD = 'blue_back';
  private GRAYCARD = 'gray_back';

  // game: Observable<any[]>;
  // plyrsColRef: AngularFirestoreCollection<any>;
  // playerref: AngularFirestoreDocument;
  plyrsCol: Observable<any[]>;
  gameState: Observable<any>;

  handRef: AngularFirestoreDocument;

  constructor(protected firestore: AngularFirestore) {
    // this.game = firestore.collection(this.GAME).valueChanges();

    // this.plyrsColRef = firestore.collection<Player>(this.GAME, ref => ref.where('gameRef', '==', this.GAME));
    this.plyrsCol = this.firestore.collection<Player>(this.GAME, ref => ref.where('gameRef', '==', this.GAME)).valueChanges(); 

    this.gameState = firestore.collection(this.GAME).doc('GameState').valueChanges();

    this.handRef = firestore.collection(this.GAME).doc(this.HAND);
  }

  PushMessage(message: string) {
    this.handRef.update({message: message});
  }

  NewTexasHoldEmGame(holdemGame: TexasHoldEm) {
    this.holdem = holdemGame;
  }

  AddPlayer(player: Player) {
      // Get the document ref of a new player and set it
      player.gameRef = this.GAME;
      this.firestore.collection(this.GAME).add(player)
      .then((docRef) => {
        this.firestore.collection(this.GAME).doc(docRef.id).update({docRef: docRef.id});
    });
  }

  // ShowFireBaseItem(): Observable<any[]> {
  //   return this.game;
  // }

  GetFlop(): Observable<any> {
    return this.handRef.valueChanges();
  }

  GetPlayers(): Observable<Player[]> {
      return this.plyrsCol;
  }

  Hand(): Observable<any> {
    return this.handRef.valueChanges();
  }

  IsGameReady(): Observable<any> {
    return this.gameState;
  }

  LoadPlayer(docRef: string): Observable<any> {
    return this.firestore.collection(this.GAME).doc<Player>(docRef).valueChanges();
  }

  CurrentHoldEmGame(): TexasHoldEm {
    if (!this.holdem) {
      this.holdem = new TexasHoldEm(1,1);
      this.holdem.Deck.Shuffle();
    }
    return this.holdem;
  }

  ShowCards() {
    // Show all non-folded players
    this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
    .where('folded', '==', false)
    .where('canBet', '==', true))
    .get()
    .subscribe((val) => {         
      const batch = this.firestore.firestore.batch();
      val.forEach((doc) => {
        const batchRef = this.firestore.firestore.collection(this.GAME).doc(doc.data().docRef);
        batch.update(batchRef, {showCards: true});
      });
      batch.commit().then(() => {
        // reset the hand
        this.PushMessage('Showing cards');
      });
    });
  }

  FoldPlayer(player: string) {
    // remove this player from the list of PlayingPlayers
    const playerref = this.firestore.collection(this.GAME).doc(player);
    playerref.update({folded: true, cardOne: this.GRAYCARD, cardTwo: this.GRAYCARD});
  }

  NewHand() {
     this.handRef.get()
       .subscribe((docHandRef) => {
          const winningPlayer = docHandRef.get('winner')
          if (winningPlayer.length === 0) {
            this.PushMessage('You have to declare at least one winner')
          } else {
            // update the winners stack with the pot, then do this
            const pot = docHandRef.get('potsize');
            debugger;

            const increaseStacktBy = firebase.firestore.FieldValue.increment(Number(pot));
            const playerref = this.firestore.collection(this.GAME).doc(winningPlayer[0]);
            playerref.update({stack: increaseStacktBy});
        
            // this.PushMessage(msg);

            this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
            .where('canBet', '==', true))
            .get()
            .subscribe((val) => {
              const batch = this.firestore.firestore.batch();
              val.forEach((doc) => {
                const batchRef = this.firestore.firestore.collection(this.GAME).doc(doc.data().docRef);
                batch.update(batchRef, {folded: false, cardOne: '', cardTwo: '', showCards: false});
              });
              batch.commit().then(() => {
                // reset the hand
                this.handRef.update({cardOne: this.BLUECARD,
                  cardTwo: this.BLUECARD,
                  cardThree: this.BLUECARD,
                  cardFour: this.BLUECARD,
                  cardFive: this.BLUECARD,
                  message: '',
                  winner: [],
                  potsize: 0});
              });
            });
      
            this.holdem.Deck.Shuffle();
            // this.CurrentHoldEmGame().Deck.Shuffle();
          }
       }) 
  }

  DealHand() {
    const newHand = false;
    //  only deal to players that haven't folded
    this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
        .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((val) => {
          const batch = this.firestore.firestore.batch();
          val.forEach((doc) => {
          const batchRef = this.firestore.firestore.collection(this.GAME).doc(doc.data().docRef);
          for (let i = 0; i < 2; i++) {
            const whichCard = i === 0 ? 'One' : 'Two';
            const card = this.CurrentHoldEmGame().Deck.cards.pop();

            // const dto = {}; dto['card' + whichCard] = newHand ? '' : card.url;
            const dto = {}; dto['card' + whichCard] = card.url;
            batch.update(batchRef, dto);
          }
        });
          batch.commit().then(() => {
            const msg = 'Hand dealt';
            this.PushMessage(msg);
          });
        });
  }

  DealTurn() {
    this.CurrentHoldEmGame().Deck.cards.pop();

    this.handRef.update({cardFour: this.CurrentHoldEmGame().Deck.cards.pop().url});

    this.PushMessage('Dealing turn');
  }

  DealRiver() {
    this.CurrentHoldEmGame().Deck.cards.pop();

    this.handRef.update({cardFive: this.CurrentHoldEmGame().Deck.cards.pop().url});

    this.PushMessage('Dealing river');    
  }

  DealFlop() {
    this.CurrentHoldEmGame().Deck.cards.pop();

    this.handRef.update({cardOne: this.CurrentHoldEmGame().Deck.cards.pop().url,
      cardTwo: this.CurrentHoldEmGame().Deck.cards.pop().url,
      cardThree: this.CurrentHoldEmGame().Deck.cards.pop().url});

      this.PushMessage('Dealing flop');
  }

  UpdatePlayerStack(amount: number, player: string, name: string, betAmount: number) {
    const playerref = this.firestore.collection(this.GAME).doc(player);
    playerref.update({stack: amount});

    const increasePotBy = firebase.firestore.FieldValue.increment(Number(betAmount));
    this.handRef.update({potsize: increasePotBy});

    const msg = name + ' bets ' + betAmount
    this.PushMessage(msg);
  }

  AddWinner(playerRef: string) {
    this.handRef.update({
      winner: firebase.firestore.FieldValue.arrayUnion(playerRef)
  });
  }

  RemovePlayer(playerRef: string) {
    this.handRef.update({
      winner: firebase.firestore.FieldValue.arrayRemove(playerRef) 
  });
  }

  StartGame(players: Array<Player>) {
    // players.forEach(player => {
    //   // Get the document ref of a new player and set it
    //   player.gameRef = this.GAME;
    //   // this.firestore.collection(this.GAME).add({stack: player.stack, name: player.folded, gameRef: this.GAME});
    //   this.firestore.collection(this.GAME).add(player)
    //   .then((docRef) => {
    //     debugger;
    //     this.firestore.collection(this.GAME).doc(docRef.id).update({docRef: docRef.id});
    //   });
    // });
    this.firestore.collection(this.GAME).doc('GameState').update({Ready: true});
  }
}
