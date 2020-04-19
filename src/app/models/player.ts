import { Card } from './card';
export interface IPlayer {
    canBet: boolean;
    folded: boolean;
    cardOne: string;
    cardTwo: string;
    stack: number;
    name: string;
    docRef?: string;
    gameRef?: string;
}
export class Player { // implements IPlayer {
    canBet: boolean;
    folded: boolean;
    cardOne: string;
    cardTwo: string;
    stack: number;
    name: string;
    docRef: string;
    gameRef: string;
    
    // constructor(public stack: number, readonly name: string, public docRef: string) {
    constructor() {
        // this.docRef = '_' + Math.random().toString(36).substr(2, 9);
        this.canBet = true;
        this.folded = false;
    }

    // tslint:disable-next-line:typedef-whitespace
    // Bet(amount: number) : boolean {
    //     if (Number(amount) > Number(this.stack)) {
    //         return false;
    //     } else {
    //         this.stack -= amount;
    //         return true;
    //         // raise event to increate Pot size
    //     }
    // }

    // // DocumentRef(): string {
    // //     return this.docRef;
    // // }

    // Ante(amount: number) {
    //     if (amount > this.stack) {
    //         this.stack = 0;
    //         return;
    //     }
    //     this.Bet(amount);
    // }

    // IsEliminated(): boolean {
    //     return this.stack === 0 ? true : false;
    // }

    // GetStack(): number {
    //     return this.stack;
    // }

    // CanBet(): boolean {
    //     return this.canBet;
    // }
}
