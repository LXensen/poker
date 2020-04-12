import { Deck } from './deck';
import { Player } from './player';

export class Game {
    Players: Array<Player>;
    Deck: Deck;
    // private buyin: number; -- I think the game should have the buy in?
    constructor() {
        this.Deck = new Deck();
        this.Players = new Array<Player>();
    }

    AddPlayer(player: Player) {
        this.Players.push(player);
    }

    RemovePlayer(player: Player) {

    }
}
