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

  blindBackground = 'form-control mr-sm-2';
  timeLeft = '0:00';
  isVisible = 'invisible';
  message = '';
  potsize = 0;
  isGameReady = false;
  plyr: Observable<Player>;
  smallAmount = 0;
  bigAmount = 0;

  dealDisabled = false;
  flopDisabled = false;
  turnDisabled = false;
  riverDisabled = false;

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
    this.broker.GameState().subscribe((value) => {
      this.isGameReady = value.Ready;
      if (value.Ready) {
        this.startTimer(value.duration);
        this.bigAmount = value.big;
        this.smallAmount = value.small;
      }
    });

    this.broker.Hand().subscribe((value) => {
      this.isVisible = 'visible';
      if (value.message === '') {
        this.isVisible = 'invisible';
        if ( value.potsize === 0 ) {
          this.dealDisabled = false;
          this.flopDisabled = false;
          this.turnDisabled = false;
          this.riverDisabled = false;
        }
       } else {
        this.message = value.message;
        this.potsize = value.potsize;
       }

    });
  }

  private startTimer(blindDurationInMinutes: number) {
    let total = Number(blindDurationInMinutes * 60000); // this will be duration
    const source = timer(1000, 1000).subscribe(val => {
      if (total === 0) {
        this.timeLeft = '0:00';
        source.unsubscribe();
        this.blindBackground = 'form-control mr-sm-2 bg-danger';
      } else {
        total = total - 1000;
        this.timeLeft = this.millisToMinutesAndSeconds(total);
      }
    });
  }

  private millisToMinutesAndSeconds(millis) {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000);
    // tslint:disable-next-line:max-line-length
    return (Number(seconds) === 60 ? Number((minutes + 1)) + ':00' : Number(minutes) + ':' + (Number(seconds) < 10 ? '0' : '') + Number(seconds));
  }

  AddPlayer(pname: string, buyin: number) {
    const plyr: Player = {
      name: pname,
      stack: buyin,
      canBet: true,
      folded: false,
      smAntee: false,
      bgAntee: false,
      showCards: false,
      dealer: false,
      cardOne: '',
      cardTwo: '',
      docRef: '',
      gameRef: ''
    };
    // this.broker.CurrentHoldEmGame().AddPlayer(plyr);
    if ( buyin ) {
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
    this.dealDisabled = true;
  }

  NewHand() {
    this.broker.NewHand();
  }

  DealFlop() {
    this.broker.DealFlop();
    this.flopDisabled = true;
  }

  DealTurn() {
    this.broker.DealTurn();
    this.turnDisabled = true;
  }

  ShowCards() {
    this.broker.ShowCards();
  }

  DealRiver() {
    this.broker.DealRiver();
    this.riverDisabled = true;
  }

  // NewGame(buyin: number) {
  //   this.broker.NewTexasHoldEmGame(new TexasHoldEm(1, 1));
  //   this.broker.CurrentHoldEmGame().Deck.Shuffle();
  // }

  StartGame(smallBlind: number, bigBlind: number, duration: number) {
    // this.broker.StartGame(this.broker.CurrentHoldEmGame().Players);
    this.blindBackground = 'form-control mr-sm-2';
    if ( Number(duration)) {
      this.broker.StartGame(Number(smallBlind), Number(bigBlind), Number(duration));
    } else {
      this.broker.PushMessage('Blind duration is not a number');
    }
  }
}
