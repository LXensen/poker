export class Player {
    private canBet = true;
    private docRef: string;
    constructor(private stack: number, readonly name: string) {
        this.docRef = '_' + Math.random().toString(36).substr(2, 9);
    }

    // tslint:disable-next-line:typedef-whitespace
    Bet(amount: number) : boolean {
        if (amount > this.stack) {
            return false;
        } else {
            this.stack -= amount;
            return true;
            // raise event to increate Pot size
        }
    }

    DocumentRef(): string {
        return this.docRef;
    }

    Ante(amount: number) {
        if (amount > this.stack) {
            this.stack = 0;
            return;
        }
        this.Bet(amount);
    }

    IsEliminated(): boolean {
        return this.stack === 0 ? true : false;
    }

    GetStack(): number {
        return this.stack;
    }

    CanBet(): boolean {
        return this.canBet;
    }
}
