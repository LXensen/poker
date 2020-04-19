import { Observable, iif } from 'rxjs';
import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Player, IPlayer } from '../models/player';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-texas-hold-em-game',
  templateUrl: './texas-hold-em-game.component.html',
  styleUrls: ['./texas-hold-em-game.component.css']
})
export class TexasHoldEmGameComponent implements OnInit {
  @ViewChild('playerName') betInput: ElementRef;

  isGameReady = false;
  plyr: Observable<Player>;
  games: Observable<any[]>;

  constructor(private broker: GameHubBrokerService) {
    // this.broker.ShowFireBaseItem().subscribe((val) => {
    //   // this.games = val;
    //   // THIS GETS THE ROOT OF THE DATABASE
    //   val.forEach((x) => {
    //     const b = '';
    //     // tslint:disable-next-line:no-debugger
    //     // debugger;
    //   });
    // });
   }

  ngOnInit() {
    this.broker.IsGameReady().subscribe((value) => {
      this.isGameReady = value.Ready;
    });
  }

  AddPlayer(pname: string, buyin: number) {
    const plyr: Player = {
      name: pname,
      stack: buyin,
      canBet: true,
      folded: false,
      cardOne: '',
      cardTwo: '',
      docRef: '',
      gameRef: ''
    };
    this.broker.CurrentHoldEmGame().AddPlayer(plyr);
    this.broker.AddPlayer(plyr);
    this.betInput.nativeElement.value = '';
  }

  Players(): Array<Player> {
    return (this.broker.CurrentHoldEmGame() ? this.broker.CurrentHoldEmGame().Players : new Array<Player>());
    // return (this.broker.CurrentHoldEmGame() ? this.broker.ShowFireBasePlayers() : new Array<Player>());
  }

  Deal() {
    this.broker.DealHand();
  }

  NewHand() {
    this.broker.NewHand();
  }

  DealFlop() {
    this.broker.DealFlop();
  }

  DealTurn() {
    this.broker.DealTurn();
  }

  DealRiver() {
    this.broker.DealRiver();
  }

  GetPotSize() {

  }

  NewGame(buyin: number) {
    this.broker.NewTexasHoldEmGame(new TexasHoldEm(1, 1));
    this.broker.CurrentHoldEmGame().Deck.Shuffle();
  }

  StartGame() {
    // this.childComp.players = this.parentplayers;
    this.broker.StartGame(this.broker.CurrentHoldEmGame().Players);
  }
}
