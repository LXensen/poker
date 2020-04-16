import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component,  OnInit,  ComponentFactoryResolver,  Injector,  Input} from '@angular/core';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css']
})
export class TableComponentComponent implements OnInit {
  @Input()
  set players(value: Array<Player>) {
    this.allPlayers = value;
  }

  isGameReady = false;

  allPlayers = new Array<Player>();

  constructor(private broker: GameHubBrokerService) { }

  ngOnInit(): void {
    this.broker.IsGameReady().subscribe((value) => {
      this.isGameReady = value.Ready;
    });
    this.broker.ShowFireBasePlayersCollection().subscribe((val) => {
      return val.map(res => {
        // this.allPlayers.push(new Player(res.Stack, res.Name));
          // tslint:disable-next-line:no-debugger
        debugger;
      });
    });
    }
}
