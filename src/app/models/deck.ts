import { Card } from './card';
export class Deck {
    cards: Array<Card>;
    constructor() {
        this.cards = new Array<Card>();
        this.InitCards();
    }

    Shuffle() {
        console.log('shuffle');
        let m = this.cards.length;
        let t: Card;
        let i: number;

        // While there remain elements to shuffle…
        while (m) {
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);
          // And swap it with the current element.
          t = this.cards[m];
          this.cards[m] = this.cards[i];
          this.cards[i] = t;
        }
        // return array;
    }

    private InitCards() {
        for (const suit in Card.Suit) {
            if (!Number(suit)) {
                let score = 1;
                for (const rank in Card.Rank) {
                     if (!Number(rank)) {
                         this.cards.push(new Card(suit as Card.Suit, rank as Card.Rank, score));
                         score++;
                     }
                 }
            }
        }
        // this.cards.forEach(card => {
        //     console.log(card.rank + card.suit + ' ' + card.score);
        // });
    }
}
