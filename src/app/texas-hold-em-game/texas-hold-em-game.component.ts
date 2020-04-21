import { Observable } from 'rxjs';
import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-texas-hold-em-game',
  templateUrl: './texas-hold-em-game.component.html',
  styleUrls: ['./texas-hold-em-game.component.css']
})
export class TexasHoldEmGameComponent implements OnInit {
  @ViewChild('playerName') betInput: ElementRef;

  isVisible = "invisible";
  message = '';
  potsize = 0;
  isGameReady = false;
  plyr: Observable<Player>;
  // games: Observable<any[]>;

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

    this.broker.Hand().subscribe((value) => {
      if (value.message === '') {
        this.isVisible = 'invisible'
      } else {
        this.isVisible = 'visible'        
      }
      this.message = value.message;
      this.potsize = value.potsize
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
    // this.broker.CurrentHoldEmGame().AddPlayer(plyr);
    this.broker.AddPlayer(plyr);
    this.betInput.nativeElement.value = '';
  }

  Players(): Array<Player> {
    return (this.broker.CurrentHoldEmGame() ? this.broker.CurrentHoldEmGame().Players : new Array<Player>());
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

  NewGame(buyin: number) {
    this.broker.NewTexasHoldEmGame(new TexasHoldEm(1, 1));
    this.broker.CurrentHoldEmGame().Deck.Shuffle();
  }

  StartGame() {
    this.broker.StartGame(this.broker.CurrentHoldEmGame().Players);
  }
}
