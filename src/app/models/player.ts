export class Player {
    private canBet = true;
    constructor(private stack: number, readonly name: string) {

    }

    // tslint:disable-next-line:typedef-whitespace
    Bet(amount: number) : boolean {
        if (amount > this.stack) {
            return false;
        } else {
            this.stack -= amount;
            return true;
        }
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
