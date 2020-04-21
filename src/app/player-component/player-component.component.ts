import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-player-component',
  templateUrl: './player-component.component.html',
  styleUrls: ['./player-component.component.css']
})
export class PlayerComponentComponent implements OnInit, OnChanges {
  @ViewChild('betInput') betInput: ElementRef;

  private cardPath = 'assets/images/';
  public flippedCardSRC = 'blue_back.png';
  public foldedCardSRC = 'gray_back.png';

  public card1SRC = this.cardPath + this.flippedCardSRC;
  public card2SRC = this.cardPath + this.flippedCardSRC;
  public isDisabled = false;
  public isChecked = false;

  currentPlayer: Player;

  @Input()
  set player(plyr: Player) {
    this.card2SRC = this.cardPath + this.flippedCardSRC;
    this.card1SRC = this.cardPath + this.flippedCardSRC;


    if (plyr) {
    debugger;
    this.broker.LoadPlayer(plyr.docRef).subscribe((val) => {
      this.isDisabled = false;

      this.currentPlayer = val;
      if ( this.currentPlayer.cardOne === '') {
         this.card1SRC = this.cardPath + this.flippedCardSRC;
       }

      if ( this.currentPlayer.cardTwo === '') {
         this.card2SRC = this.cardPath + this.flippedCardSRC;
       }

      if ( this.currentPlayer.folded ) {
         this.card1SRC = this.cardPath + this.foldedCardSRC;
         this.card2SRC = this.cardPath + this.foldedCardSRC;
         this.isDisabled = true;
       }
    });
  }
  }

  constructor(private broker: GameHubBrokerService) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  changed(event: any) {
    if (event.target.checked) {
      this.broker.AddWinner(this.currentPlayer.docRef);
    } else {
      this.broker.RemovePlayer(this.currentPlayer.docRef);
    }
  }

  FoldHand() {
    this.broker.FoldPlayer('', this.currentPlayer.docRef);
    this.isDisabled = true;
  }

  Check() {
    this.broker.PushMessage(this.currentPlayer.name + ' checks');
  }

  TurnOverCards() {
    if ( this.currentPlayer.cardOne === '' ) {
      this.broker.PushMessage('No card to see, ' + this.currentPlayer.name + '. No one has dealt yet!')
    } else {
      this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
      this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
    }

  }

  Bet(amount: number) {
    if (this.currentPlayer.stack - amount >= 0) {
      this.broker.UpdatePlayerStack(this.currentPlayer.stack - amount, this.currentPlayer.docRef, this.currentPlayer.name, amount);
      this.betInput.nativeElement.value = '';      
    } else {
      this.broker.PushMessage(this.currentPlayer.name + ' tried to bet more than he has...Try again');
    }
  }
}
