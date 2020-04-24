import { GameHubBrokerService } from './../services/game-hub-broker.service';
import { Player } from './../models/player';
import { Component,  OnInit } from '@angular/core';

@Component({
  selector: 'app-table-component',
  templateUrl: './table-component.component.html',
  styleUrls: ['./table-component.component.css']
})
export class TableComponentComponent implements OnInit {
  // @Input()
  // set players(value: Array<Player>) {
  //   this.allPlayers = value;
  // }

  isGameReady = false;

  allPlayers = new Array<Player>();

  constructor(private broker: GameHubBrokerService) { }

  ngOnInit(): void {
    this.broker.GameState().subscribe((value) => {
      this.isGameReady = value.Ready;
    });

    this.broker.GetPlayers().subscribe((val) => {
      val.map(res => {
        // const data = res.payload.doc.data();
        let exists = false;
        if ( this.allPlayers.length > 0 ) {
          // tslint:disable-next-line:prefer-for-of
          for ( let i = 0; i < this.allPlayers.length; i++) {
            if (this.allPlayers[i].docRef === res.docRef) {
              exists = true;
            }
          }
        }
        if (!exists) {
          this.allPlayers.push(res);
        }
      });
    });
    }
}
