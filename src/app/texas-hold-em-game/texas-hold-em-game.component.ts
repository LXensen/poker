import { Observable } from 'rxjs';
import { GameHubBrokerService } from './../services/game-hub-broker.service';
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
  plyrs: Observable<Player[]>;
  plyr: Observable<Player>;
  private potSize: number;
  addNewPlayerButtonEnabled = false;
  games: Observable<any[]>;

  constructor(private broker: GameHubBrokerService, firestore: AngularFirestore) {
    this.broker.ShowFireBaseItem().subscribe((val) => {
      // tslint:disable-next-line:no-debugger
      // debugger;
      // this.games = val;
      val.forEach((x) => {
        const b = '';
        // tslint:disable-next-line:no-debugger
        // debugger;
      });
    });
    // this.plyrs = this.broker.ShowFireBasePlayers();
   }

  ngOnInit() {
    this.broker.ShowFireBasePlayers().subscribe((val) => {
      // tslint:disable-next-line:no-debugger
      debugger;
    });
  }

  AddPlayer(name: string, buyin: number) {
    this.broker.AddPlayer(new Player(buyin, name));
  }

  Players(): Array<Player> {
    return (this.broker.CurrentHoldEmGame() ? this.broker.CurrentHoldEmGame().Players : new Array<Player>());
    // return (this.broker.CurrentHoldEmGame() ? this.broker.ShowFireBasePlayers() : new Array<Player>());
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
    this.broker.NewTexasHoldEmGame(new TexasHoldEm(smblind, bgblind));
    this.broker.CurrentHoldEmGame().Deck.Shuffle();
    this.addNewPlayerButtonEnabled = true;
  }

}
