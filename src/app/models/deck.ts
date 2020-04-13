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
        // return this.cards;
    }

    private InitCards() {
        let convertedRank: string;
        for (const suit in Card.Suit) {
            if (!Number(suit)) {
                let score = 2;
                for (const rank in Card.Rank) {
                     if (!Number(rank)) {
                         const suitChar = suit.charAt(0);
                         const rankMod = Number(this.getEnumKeyByValue(rank));
                         if (rankMod > 10) {
                            switch (rankMod) {
                                case 11: {
                                    convertedRank = 'J';
                                    break;
                                }
                                case 12: {
                                    convertedRank = 'Q';
                                    break;
                                }
                                case 13: {
                                    convertedRank = 'K';
                                    break;
                                }
                                case 14: {
                                    convertedRank = 'A';
                                    break;
                                }
                            }
                         } else {
                             convertedRank = rankMod.toString();
                         }
                         this.cards.push(new Card(Card.Suit[suit], Card.Rank[rank.toString()], score, convertedRank + suitChar));
                         score++;
                     }
                 }
            }
        }
        // this.cards.forEach(card => {
        //     console.log(card.cardRank + ' ' + card.cardSuit + ' ' + card.score + ' ' + card.url);
        // });
    }

    private getEnumKeyByValue(value) {
        const keys = Object.keys(Card.Rank).filter(x => Card.Rank[x] === value);
        return keys.length > 0 ? keys[0] : null;
    }
}
