export class Player {
    canBet: boolean;
    folded: boolean;
    hasChecked: boolean;
    smAntee: boolean;
    bgAntee: boolean;
    dealer: boolean;
    showCards: boolean;
    cardOne: string;
    cardTwo: string;
    stack: number;
    name: string;
    docRef: string;
    gameRef: string;
    totalBet: number;

    constructor() {
        this.canBet = true;
        this.folded = false;
        this.hasChecked = false;
        this.smAntee = false;
        this.bgAntee = false;
        this.dealer = false;
    }
}
