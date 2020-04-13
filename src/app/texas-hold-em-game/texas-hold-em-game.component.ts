import { Observable } from 'rxjs';
import { GameHubBrokerService, Plyr } from './../services/game-hub-broker.service';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Component, OnInit } from '@angular/core';
import { Player } from '../models/player';
import { AngularFirestore } from '@angular/fire/firestore';

// export interface Plyr { Name: string; Stack: number; }

@Component({
  selector: 'app-texas-hold-em-game',
  templateUrl: './texas-hold-em-game.component.html',
  styleUrls: ['./texas-hold-em-game.component.css']
})
export class TexasHoldEmGameComponent implements OnInit {
  plyrs: Observable<Plyr[]>;
  plyr: Observable<Plyr>;
  private potSize: number;
  addNewPlayerButtonEnabled = false;
  games: Observable<any[]>;

  allPlayers = new Array<Plyr>();

  constructor(private broker: GameHubBrokerService, firestore: AngularFirestore) {
    this.broker.ShowFireBaseItem().subscribe((val) => {
      // tslint:disable-next-line:no-debugger
      debugger;
      // this.games = val;
    });
    this.plyrs = this.broker.ShowFireBasePlayers();
   }

  ngOnInit() {
    this.broker.ShowFireBasePlayer().subscribe((val) => {
      // tslint:disable-next-line:no-debugger
      // debugger;
      this.plyr = val;
    });
  }

  AddPlayer(name: string) {
    this.broker.AddPlayer(new Player(5, name));

  }

  Players(): Array<Player> {
    // return (this.holdEmGame ? this.holdEmGame.Players : new Array<Player>());
    return (this.broker.CurrentHoldEmGame() ? this.broker.CurrentHoldEmGame().Players : new Array<Player>());
  }

  Deal() {
    // re-enable all the players. If someone folded, I've disabled the buttons
  }

  DealFlop() {

  }

  DealTurn() {

  }

  DealRiver() {

  }

  GetPotSize() {

  }

  NewGame(smblind: number, bgblind: number, buyin: number) {
    // this.broker.NewTexasHoldEmGame(new TexasHoldEm(smblind, bgblind));
    // this.broker.CurrentHoldEmGame().Deck.Shuffle();
    this.addNewPlayerButtonEnabled = true;
  }

}
