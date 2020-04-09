import { Card } from './card';
export class Deck {
    cards: Array<Card>;
    constructor() {
        this.cards = new Array<Card>();
        this.InitCards();
    }

    Shuffle() {
        console.log('shuffle');
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
