import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css']
})
export class TableComponentComponent implements OnInit {
  public players: Observable<Player>;

  constructor(private broker: GameHubBrokerService) { }

  ngOnInit(): void {
    this.broker.ShowFireBasePlayers().subscribe((val) => {
      // tslint:disable-next-line:no-debugger
      debugger;
    });
  }

}
