export class Player {
    canBet: boolean;
    folded: boolean;
    cardOne: string;
    cardTwo: string;
    stack: number;
    name: string;
    docRef: string;
    gameRef: string;

    constructor() {
        this.canBet = true;
        this.folded = false;
    }
}
