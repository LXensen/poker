import { Deck } from './../models/deck';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Player } from './../models/player';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class GameHubBrokerService {
  private currentDeck: Deck;
  private HAND = 'Hand';
  private GAME = 'Game3';
  private BLUECARD = 'blue_back';
  private GRAYCARD = 'gray_back';

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
    // tslint:disable-next-line:object-literal-shorthand
    this.handRef.update({message: message});
  }

  UseDeck(shouldUseDeck: boolean) {
    this.handRef.update({useDeck: false});
  }

  SetDealer(playerRef: string) {
    const playerref = this.firestore.collection(this.GAME).doc(playerRef);
    playerref.update({dealer: true});
  }

  AddPlayer(player: Player) {
      // Get the document ref of a new player and set it
      player.gameRef = this.GAME;
      this.firestore.collection(this.GAME).add(player)
      .then((docRef) => {
        this.firestore.collection(this.GAME).doc(docRef.id).update({docRef: docRef.id});
    });
  }

  GetFlop(): Observable<any> {
    return this.handRef.valueChanges();
  }

  GetPlayers(): Observable<Player[]> {
      return this.plyrsCol;
  }

  Hand(): Observable<any> {
    return this.handRef.valueChanges();
  }

  GameState(): Observable<any> {
    return this.gameState;
  }

  LoadPlayer(docRef: string): Observable<any> {
    return this.firestore.collection(this.GAME).doc<Player>(docRef).valueChanges();
  }

  Deck(): Deck {
    if (!this.currentDeck) {
      this.currentDeck = new Deck();
      console.log('new deck');
    }
    return this.currentDeck;
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

  CheckPlayer(player: string) {
    // remove this player from the list of PlayingPlayers
    debugger;
    const playerref = this.firestore.collection(this.GAME).doc(player);
    playerref.update({hasChecked: true});
  }

  NewHand() {
    // let playerName = '';

    this.handRef.get()
       .subscribe((docHandRef) => {
          const winningPlayer = docHandRef.get('winner');
          if (winningPlayer.length === 0) {
            this.PushMessage('You have to declare at least one winner');
          } else {
            // update the winners stack with the pot, then do this
            let pot = docHandRef.get('potsize');

            if ( winningPlayer.length === 2) {
              pot = pot / 2;
            }
            const increaseStacktBy = firebase.firestore.FieldValue.increment(Number(pot));

            winningPlayer.forEach(player => {
              const playerref = this.firestore.collection(this.GAME).doc(player);
              playerref.update({stack: increaseStacktBy});
            });


            // this.firestore.collection(this.GAME).doc(winningPlayer[0]).get().subscribe(win => {
            //   playerName = win.data().name;
            //   this.PushMessage(playerName + ' wins the hand');
            // });

            this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
            .where('canBet', '==', true))
            .get()
            .subscribe((val) => {
              const batch = this.firestore.firestore.batch();
              val.forEach((doc) => {
                const batchRef = this.firestore.firestore.collection(this.GAME).doc(doc.data().docRef);
                // reset each Player
                batch.update(batchRef, {folded: false,
                  cardOne: '',
                  cardTwo: '',
                  totalBet: 0,
                  showCards: false,
                  hasChecked: false,
                  smAntee: false,
                  bgAntee: false,
                  dealer: false});
              });
              batch.commit().then(() => {
                // make sure players with no money ( stack = 0 ) are set to canbet = false
                this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
                .where('stack', '<', 1))
                .get()
                .subscribe((players) => {
                  players.forEach((player) => {
                    if ( player.get('canBet') === true ) {
                      const playerref = this.firestore.collection(this.GAME).doc(player.data().docRef);
                      playerref.update({canBet: false, stack: 0});
                    }
                  });
                });
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
          }
       });
  }

  DealHand() {
    // shuffle the deck before dealing
    this.Deck().Shuffle();
    // should only get players that are still 'active'
    this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
        .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((playerRef) => {
          const batch = this.firestore.firestore.batch();
          playerRef.forEach((player) => {
          const batchRef = this.firestore.firestore.collection(this.GAME).doc(player.data().docRef);
          const card = this.Deck().cards.pop();
          batch.update(batchRef, {cardOne: card.url});
          console.log(card.url + ' ' + player.data().name);

        });
          batch.commit().then(() => {

          });
        });

    // Now deal the second card, cardTwo. Doing this rathe than the for loop so that it approximates actual 'dealing', where
    // you deal one card at a time to each player
    this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
        .where('folded', '==', false)
        .where('canBet', '==', true))
        .get()
        .subscribe((playerRef) => {
          const batch = this.firestore.firestore.batch();
          playerRef.forEach((player) => {
          const batchRef = this.firestore.firestore.collection(this.GAME).doc(player.data().docRef);
          const card = this.Deck().cards.pop();
          batch.update(batchRef, {cardTwo: card.url});
        });
          batch.commit().then(() => {
          const msg = 'Dealing hand';
          this.PushMessage(msg);
          });
        });
  }

  private ResetPlayersBetTotal() {
    const batch = this.firestore.firestore.batch();

    this.firestore.collection(this.GAME, ref => ref.where('gameRef', '==', this.GAME)
    .where('folded', '==', false)
    .where('canBet', '==', true))
    .get()
    .subscribe((playerRef) => {
      playerRef.forEach((player) => {
      const batchRef = this.firestore.firestore.collection(this.GAME).doc(player.data().docRef);
      batch.update(batchRef, {totalBet: 0, hasChecked: false});
    });
      batch.commit().then(() => {

      });
    });

  }

  DealTurn() {
    this.Deck().cards.pop();

    this.handRef.update({cardFour: this.Deck().cards.pop().url});

    // reset total bet
    this.ResetPlayersBetTotal();
    this.PushMessage('Dealing turn');
  }

  DealRiver() {
    this.Deck().cards.pop();

    this.handRef.update({cardFive: this.Deck().cards.pop().url});

    // reset total bet
    this.ResetPlayersBetTotal();
    this.PushMessage('Dealing river');
  }

  DealFlop() {
    this.Deck().cards.pop();

    this.handRef.update({cardOne: this.Deck().cards.pop().url,
      cardTwo: this.Deck().cards.pop().url,
      cardThree: this.Deck().cards.pop().url});

    // reset total bet
    this.ResetPlayersBetTotal();
    this.PushMessage('Dealing flop');
  }

  Bet(amount: number, player: string, name: string, betAmount: number, anteeType?: string) {
    let msg = '';
    const increaseBy = firebase.firestore.FieldValue.increment(Number(betAmount));

    const playerref = this.firestore.collection(this.GAME).doc(player);

    if ( anteeType === 'small' ) {
      playerref.update({stack: amount, smAntee: true, totalBet: increaseBy});
      msg = name + ' anteed ' + betAmount;
    }

    if ( anteeType === 'big' ) {
      playerref.update({stack: amount, bgAntee: true, totalBet: increaseBy});
      msg = name + ' anteed ' + betAmount;
    }

    // just a 'normal' bet
    if (anteeType === undefined) {
      playerref.update({stack: amount, totalBet: increaseBy});
      msg = name + ' bets ' + betAmount;
    }

    this.handRef.update({potsize: increaseBy});

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

  StartGame(smallBlind: number, bigBlind: number, blindDuration: number) {
    this.firestore.collection(this.GAME).doc('GameState').update({Ready: true, small: smallBlind, big: bigBlind, duration: blindDuration});
  }
}
