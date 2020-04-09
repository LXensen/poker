import { Deck } from './deck';
import { Player } from './player';

export class Game {
    Players: Array<Player>;
    Deck: Deck;
    constructor() {
        this.Deck = new Deck();
        this.Players = new Array<Player>();
    }
}
