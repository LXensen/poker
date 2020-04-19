import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

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

  currentPlayer: Player;

  @Input()
  set player(plyr: Player) {
    this.card2SRC = this.cardPath + this.flippedCardSRC;
    this.card1SRC = this.cardPath + this.flippedCardSRC;


    if (plyr) {
    this.broker.LoadPlayer(plyr.docRef).subscribe((val) => {
      // debugger;
      this.isDisabled = false;

      this.currentPlayer = val; // new Player(val.stack, val.name, plyr.DocumentRef());
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

  FoldHand() {
    this.broker.FoldPlayer('', this.currentPlayer.docRef);
    this.isDisabled = true;
  }

  WinsHand(player: Player) {

  }

  TurnOverCards() {
    this.card1SRC = this.cardPath + this.currentPlayer.cardOne + '.png';
    this.card2SRC = this.cardPath + this.currentPlayer.cardTwo + '.png';
  }

  Bet(amount: number) {
    if (amount < this.currentPlayer.stack) {
      this.broker.UpdatePlayerStack(this.currentPlayer.stack, this.currentPlayer.docRef);
      this.betInput.nativeElement.value = '';
    }
  }


  DisableButtons() {

  }
}
