import { Component, OnInit } from '@angular/core';
import { GameHubBrokerService } from '../services/game-hub-broker.service';

@Component({
  selector: 'app-flop-component',
  templateUrl: './flop-component.component.html',
  styleUrls: ['./flop-component.component.css']
})
export class FlopComponentComponent implements OnInit {
  card1SRC: string;
  card2SRC: string;
  card3SRC: string;
  card4SRC: string;
  card5SRC: string;

  private cardPath = 'assets/images/';

  constructor(private broker: GameHubBrokerService) {
    this.broker.GetFlop().subscribe((val) => {
      debugger;
      this.card1SRC = this.cardPath + val.cardOne + '.png';
      this.card2SRC = this.cardPath + val.cardTwo + '.png';
      this.card3SRC = this.cardPath + val.cardThree + '.png';
      this.card4SRC = this.cardPath + val.cardFour + '.png';
      this.card5SRC = this.cardPath + val.cardFive + '.png';
    });
  }

  ngOnInit(): void {
  }

}
