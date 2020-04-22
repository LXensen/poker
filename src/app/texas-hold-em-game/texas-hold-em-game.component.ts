import { map } from 'rxjs/operators';
import { Observable, timer, interval } from 'rxjs';
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

  timeLeft = "0:00";
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
      if (value.Ready) {
        // this.startTimer(1);
        //debugger;
      }
    });

    this.broker.Hand().subscribe((value) => {
      this.isVisible = 'visible';
      if (value.message === '') {
        //this.isVisible = 'invisible'
       } else {
        this.message = value.message;
        this.potsize = value.potsize    
       }

    });
  }

  private startTimer(blindDurationInMinutes: number) {
    let total = blindDurationInMinutes * 60000; // this will be duration
    const source = timer(1000, 1000).subscribe(val => {
      if (total === 0){
        this.timeLeft = "0:00";
        source.unsubscribe();
      } else {
        total = total - 1000;
        this.timeLeft = this.millisToMinutesAndSeconds(total);
      }
      //  console.log(total + ' ' + this.millisToMinutesAndSeconds(total));
    });
  }

  private millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000);
    return (Number(seconds) == 60 ? (minutes+1) + ":00" : minutes + ":" + (Number(seconds) < 10 ? "0" : "") + seconds);
  }
  
  AddPlayer(pname: string, buyin: number) {
    const plyr: Player = {
      name: pname,
      stack: buyin,
      canBet: true,
      folded: false,
      showCards: false,
      cardOne: '',
      cardTwo: '',
      docRef: '',
      gameRef: ''
    };
    // this.broker.CurrentHoldEmGame().AddPlayer(plyr);
    if ( buyin ) {
      debugger;
      this.broker.AddPlayer(plyr);
      this.betInput.nativeElement.value = '';
      this.broker.PushMessage(pname + ' added');
    } else {
      this.broker.PushMessage('Buyin amount is required');
      this.betInput.nativeElement.value = '';
    }

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

  ShowCards() {
    this.broker.ShowCards();
  }

  DealRiver() {
    this.broker.DealRiver();
  }

  NewGame(buyin: number) {
    this.broker.NewTexasHoldEmGame(new TexasHoldEm(1, 1));
    this.broker.CurrentHoldEmGame().Deck.Shuffle();
  }

  StartGame(duration: number) {
    this.startTimer(duration);
    this.broker.StartGame(this.broker.CurrentHoldEmGame().Players);
  }
}
