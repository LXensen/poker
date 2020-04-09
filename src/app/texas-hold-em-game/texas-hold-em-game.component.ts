import { Game } from './../models/game';
import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';

@Component({
  selector: 'app-texas-hold-em-game',
  templateUrl: './texas-hold-em-game.component.html',
  styleUrls: ['./texas-hold-em-game.component.css']
})
export class TexasHoldEmGameComponent implements OnInit {
  private game: Game;
  public smallBlind: number;
  public bigBlind: number;
  private potSize: number;

  constructor() {
    this.game = new Game();
   }

  ngOnInit() {
    this.game.Deck.Shuffle();
  }

  AddPlayer() {
    this.game.Players.push(new Player(1500, 'Lee'));
  }

  Deal() {

  }

  DealFlop() {

  }

  DealTurn() {

  }

  DealRiver() {

  }

  GetPotSize() {

  }


}
