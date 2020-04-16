import { TableComponentComponent } from './../table-component/table-component.component';
import { Observable } from 'rxjs';
import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { TexasHoldEm } from './../models/texas-hold-em';
import { Component, OnInit, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { Player } from '../models/player';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-texas-hold-em-game',
  templateUrl: './texas-hold-em-game.component.html',
  styleUrls: ['./texas-hold-em-game.component.css']
})
export class TexasHoldEmGameComponent implements OnInit {
  @ViewChild('child') childComp: TableComponentComponent;

  public parentplayers = new Array();
  plyr: Observable<Player>;
  games: Observable<any[]>;

  constructor(private broker: GameHubBrokerService, firestore: AngularFirestore) {
    this.broker.ShowFireBaseItem().subscribe((val) => {
      // tslint:disable-next-line:no-debugger
      debugger;
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
    // this.broker.ShowFireBasePlayers().subscribe((val) => {
    //   // tslint:disable-next-line:no-debugger
    // });
  }

  AddPlayer(name: string, buyin: number) {
    // this.broker.AddPlayer(new Player(buyin, name));
    this.parentplayers.push(new Player(buyin, name));
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
  }

  StartGame() {
    this.childComp.players = this.parentplayers;
    this.broker.StartGame(this.parentplayers);
  }
}
