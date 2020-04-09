
export class Card {
    readonly suit: Card.Suit; // Clubs
    readonly rank: Card.Rank; // K
    readonly score: number; // 2=2, 3=3, J=11
    readonly url: string;
    constructor( suit: Card.Suit, rank: Card.Rank, score: number, url: string = '' ) {
        this.suit = suit;
        this.rank = rank;
        this.score = score;
        this.url = url;
    }
}

// tslint:disable-next-line:no-namespace
export namespace Card {
    export enum Suit {
        Heart = 'Heart',
        Club = 'Club',
        Spade = 'Spade',
        Diamond = 'Diamond'
    }

    export enum Rank {
        Two = '2',
        Three = '3',
        Four = '4',
        Five = '5',
        Six = '6',
        Seven = '7',
        Eight = '8',
        Nine = '9',
        Ten = '10',
        Jack = '11',
        Queen = '12',
        King = '13',
        Ace = '14',
    }
}
