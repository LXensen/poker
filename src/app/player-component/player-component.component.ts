import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-player-component',
  templateUrl: './player-component.component.html',
  styleUrls: ['./player-component.component.css']
})
export class PlayerComponentComponent implements OnInit {

  @Input()
  set player(p: Player) {
    // debugger;
    // this.broker.LoadPlayer().subscribe((val) => {
    //   debugger;
    // });
  }
  constructor(private broker: GameHubBrokerService) { }

  ngOnInit() {

  }

  FoldHand(player: Player) {
    // tslint:disable-next-line:no-debugger
    debugger;
  }

  WinsHand(player: Player) {

  }

  Bet(player: Player) {
    if (player.CanBet()) {
      player.Bet(5);
    }
  }


  DisableButtons() {

  }
}
