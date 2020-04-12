import { Game } from './game';
export class TexasHoldEm extends Game {
    private bigblind: number;
    private smallblind: number;

    constructor(bigblind: number, smallblind: number) {
        super();
        this.bigblind = bigblind;
        this.smallblind = smallblind;
    }

    SmallBlind(): number {
        return this.smallblind;
    }

    BigBlind(): number {
        return this.bigblind;
    }
}
