import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-player-component',
  templateUrl: './player-component.component.html',
  styleUrls: ['./player-component.component.css']
})
export class PlayerComponentComponent implements OnInit, OnChanges {
  @ViewChild('betInput') betInput: ElementRef;

  private smallAmount: number;
  private bigAmount: number;
  private cardPath = 'assets/images/';
  private isSelectedCSSClass = 'btn btn-success';
  private secondaryUnChecked = 'btn btn-outline-secondary';
  public flippedCardSRC = 'blue_back.png';
  public foldedCardSRC = 'gray_back.png';

  public card1SRC = this.cardPath + this.flippedCardSRC;
  public card2SRC = this.cardPath + this.flippedCardSRC;
  public isDisabled = false;
  public isChecked = false;
  public smallAnteClass: string;
  public bigAnteeClass: string;
  public deallingClass: string;
  public checkedClass: string;

  currentPlayer: Player;

  @Input()
  set player(plyr: Player) {
    this.smallAnteClass = this.secondaryUnChecked;
    this.bigAnteeClass = this.secondaryUnChecked;
    this.checkedClass = this.secondaryUnChecked;

    this.deallingClass = 'btn btn-outline-success';
    this.card2SRC = this.cardPath + this.flippedCardSRC;
    this.card1SRC = this.cardPath + this.flippedCardSRC;

    if (plyr) {
    this.broker.LoadPlayer(plyr.docRef).subscribe((val) => {
      this.isDisabled = false;

      this.currentPlayer = val;

      if ( this.currentPlayer.cardOne === '') {
         this.card1SRC = this.cardPath + this.flippedCardSRC;
       }

      if ( this.currentPlayer.cardTwo === '') {
         this.card2SRC = this.cardPath + this.flippedCardSRC;
       }

      if ( this.currentPlayer.folded || (this.currentPlayer.canBet === false) ) {
         this.card1SRC = this.cardPath + this.foldedCardSRC;
         this.card2SRC = this.cardPath + this.foldedCardSRC;
         this.isDisabled = true;
       }

      if ( this.currentPlayer.smAntee ) {
        this.smallAnteClass = this.isSelectedCSSClass;
       } else {
        this.smallAnteClass = this.secondaryUnChecked;
       }

      if ( this.currentPlayer.bgAntee ) {
        this.bigAnteeClass = this.isSelectedCSSClass;
       } else {
        this.bigAnteeClass = this.secondaryUnChecked;
       }

      if ( this.currentPlayer.hasChecked ) {
         this.checkedClass = this.isSelectedCSSClass;
       } else {
         this.checkedClass = this.secondaryUnChecked;
       }

      if (this.currentPlayer.showCards) {
         this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
         this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
       }

      if ( this.currentPlayer.dealer ) {
         this.deallingClass = this.isSelectedCSSClass;
       } else {
        this.deallingClass = 'btn btn-outline-success';
       }
    });
  } else {
    this.card1SRC = this.cardPath + this.foldedCardSRC;
    this.card2SRC = this.cardPath + this.foldedCardSRC;
    this.isDisabled = true;
  }
  }

  constructor(private broker: GameHubBrokerService) {
    this.broker.GameState().subscribe((value) => {
      if (value.Ready) {
        this.bigAmount = value.big;
        this.smallAmount = value.small;
      }
    });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  IsWinner(event: any) {
    if (event.target.checked) {
      this.broker.AddWinner(this.currentPlayer.docRef);
    } else {
      this.broker.RemovePlayer(this.currentPlayer.docRef);
    }
  }

  Small() {
    if (!this.currentPlayer.smAntee && !this.currentPlayer.bgAntee) {
      this.broker.Bet((this.currentPlayer.stack - this.smallAmount),
                          this.currentPlayer.docRef,
                          this.currentPlayer.name,
                          this.smallAmount,
                          'small');
    }
  }

  Big() {
    if (!this.currentPlayer.smAntee && !this.currentPlayer.bgAntee) {
      this.broker.Bet((this.currentPlayer.stack - this.bigAmount),
                          this.currentPlayer.docRef,
                          this.currentPlayer.name,
                          this.bigAmount,
                          'big');
    }
  }

  FoldHand() {
    this.broker.FoldPlayer(this.currentPlayer.docRef);
    this.broker.PushMessage(this.currentPlayer.name + ' folds');
    this.isDisabled = true;
  }

  Check() {
    this.broker.CheckPlayer(this.currentPlayer.docRef);
    this.broker.PushMessage(this.currentPlayer.name + ' checks');
  }

  Dealer() {
    if (!this.isDisabled) {
      this.broker.SetDealer(this.currentPlayer.docRef);
    }
  }

  TurnOverCards() {
      if ( this.currentPlayer.cardOne === '' ) {
        this.broker.PushMessage('No card to see, ' + this.currentPlayer.name + '. No one has dealt yet!');
      } else {
        this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
        this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
      }
  }

  Bet(amount: number) {
    if ( !amount ) {
      this.broker.PushMessage(this.currentPlayer.name + ' you can not bet nothing. Try again....');
    } else {
      if (this.currentPlayer.stack - amount >= 0) {
        this.broker.Bet(this.currentPlayer.stack - amount, this.currentPlayer.docRef, this.currentPlayer.name, amount);
        this.betInput.nativeElement.value = '';
      } else {
        this.broker.PushMessage(this.currentPlayer.name + ' tried to bet more than he has...Try again');
      }
    }
  }
}
